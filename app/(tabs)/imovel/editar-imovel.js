import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../src/services/api';
import { COLORS } from '../../../src/theme/colors.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import InputItem from '../../../src/components/InputItem/index.js';
import CheckBox from '../../../src/components/CheckBox/index.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';
import ImageSelector from '../../../src/components/ImageSelector/index.js';
import { useAuth } from '../../../src/context/AuthContext';

export default function EditarImovel() {
    const router = useRouter();

    const { id } = useLocalSearchParams();
    const { user } = useAuth();;
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [nome, setNome] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [tipoLocacao, setTipoLocacao] = useState('RESIDENCIAL');
    const [status, setStatus] = useState('DISPONIVEL');
    const [foto, setFoto] = useState(null);
    const [fotoOriginal, setFotoOriginal] = useState(null);

    const BASE_URL = 'http://10.0.2.2:8080';

    // Carrega os dados originais do Imóvel vindo do Spring Boot
    const carregarImovel = async () => {
        try {
            setCarregando(true);
            const response = await api.get(`/imovel/${id}`);
            const imovel = response.data;

            setNome(imovel.nome);
            setCep(imovel.cep);
            setRua(imovel.rua);
            setNumero(imovel.numero);
            setComplemento(imovel.complemento || '');
            setBairro(imovel.bairro);
            setCidade(imovel.cidade);
            setEstado(imovel.estado);
            setTipoLocacao(imovel.tipoLocacao);
            setStatus(imovel.status);

            if (imovel.fotoUrl) {
                const urlCompletaFoto = `${BASE_URL}${imovel.fotoUrl}`;
                setFoto(urlCompletaFoto);
                setFotoOriginal(urlCompletaFoto);
            }

        } catch (error) {
            console.error("Erro ao puxar imóvel:", error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do imóvel.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (id) carregarImovel();
    }, [id]);

    // Envia os dados atualizados usando Multipart/Form-Data parciais (Null-Safe no Java)
    const handleSalvar = async () => {
        if (salvando) return;
        setSubmitted(true);

        const camposImovelInvalidos = !nome.trim() || !numero.trim();

        if (camposImovelInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios (*)');
            return;
        }

        try {
            setSalvando(true);

            const formData = new FormData();
            formData.append('id', String(id));
            formData.append('nome', nome);
            formData.append('numero', numero);
            formData.append('complemento', complemento);
            formData.append('tipoLocacao', tipoLocacao);
            formData.append('status', status); // Passa o status atual do imóvel

            if (foto && foto !== fotoOriginal) {
                const uriParts = foto.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('foto', {
                    uri: foto,
                    name: `imovel_editado_${Date.now()}.${fileType}`,
                    type: `image/${fileType}`
                });
            }

            // Chamando como POST na rota de atualização
            await api.post(`/imovel/atualizar/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('Sucesso', 'Imóvel atualizado com sucesso!', [
                { text: 'OK', onPress: () => router.replace(`/imovel/${id}`) }
            ]);

            setIsEditable(false);

        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
            Alert.alert('Erro', 'O servidor rejeitou as atualizações.');
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.areaLoading}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.textoLoading}>Buscando dados do imóvel...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* Título */}
            <View style={styles.areaTitulo}>
                <View style={styles.linha} />
                <Text style={styles.titulo}>Editar Imóvel</Text>
                <View style={styles.linha} />
            </View>

            {/* Formulário */}
            <View style={styles.areaFormulario}>
                <InputItem
                    label="Nome do Imóvel *"
                    placeholder="Ex: Apartamento no Centro"
                    value={nome}
                    onChangeText={setNome}
                    editable={isEditable}
                    isRequired
                    error={submitted && !nome.trim()}
                />

                <InputItem label="CEP" value={cep} editable={false} />
                <InputItem label="Rua" value={rua} editable={false} />

                <InputItem
                    label="Número *"
                    value={numero}
                    onChangeText={setNumero}
                    editable={isEditable}
                    isRequired
                    error={submitted && !numero.trim()}
                />
                <InputItem
                    label="Complemento"
                    value={complemento}
                    onChangeText={setComplemento}
                    editable={isEditable}
                />

                <InputItem label="Bairro" value={bairro} editable={false} />
                <InputItem label="Cidade" value={cidade} editable={false} />
                <InputItem label="Estado" value={estado} editable={false} />

                <View style={styles.areaTipoStatus}>
                    <Text style={styles.texto}>Tipo de locação: *</Text>
                    <View style={styles.areaCheckBox}>
                        <CheckBox
                            label="Residencial"
                            isSelected={tipoLocacao === 'RESIDENCIAL'}
                            onPress={() => isEditable && setTipoLocacao('RESIDENCIAL')}
                            disabled={!isEditable}
                        />
                        <CheckBox
                            label="Temporada"
                            isSelected={tipoLocacao === 'TEMPORADA'}
                            onPress={() => isEditable && setTipoLocacao('TEMPORADA')}
                            disabled={!isEditable}
                        />
                    </View>
                </View>

                {/* Status do imovel */}
                <View style={styles.areaTipoStatus}>
                    <Text style={styles.texto}>Status do Imóvel: *</Text>
                    <View style={styles.areaCheckBox}>
                        <CheckBox
                            label="Disponível"
                            isSelected={status === 'DISPONIVEL'}
                            onPress={() => { }}
                            disabled={true}
                        />
                        <CheckBox
                            label="Alugado"
                            isSelected={status === 'ALUGADO'}
                            onPress={() => { }}
                            disabled={true}
                        />
                    </View>
                </View>

                {/* Foto */}
                <View style={styles.areaImg}>
                    <Text style={[styles.texto, { alignSelf: 'flex-start', marginLeft: 5 }]}>Foto do Imóvel:</Text>

                    {foto ? (
                        <Image
                            source={{ uri: foto }}
                            style={[
                                styles.fotoPrevia,
                                !isEditable && { opacity: 0.8, borderColor: COLORS.lightGrey }
                            ]}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text style={styles.textoSemFoto}>Nenhuma foto cadastrada para este imóvel.</Text>
                    )}

                    <View
                        pointerEvents={isEditable ? 'auto' : 'none'}
                        style={{ width: '100%', opacity: isEditable ? 1 : 0.5, alignItems: 'center' }}
                    >
                        <ImageSelector
                            textoBtn="Alterar imagem"
                            currentImage={foto}
                            onImageSelected={(uri) => setFoto(uri)}
                        />
                    </View>
                </View>
            </View>

            {/* Botões */}
            <View style={styles.areaBotoes}>
                {isEditable ? (
                    <>
                        <ButtonLight
                            title="Cancelar"
                            onPress={() => {
                                carregarImovel();
                                setIsEditable(false);
                            }}
                            flex
                        />
                        <ButtonDark
                            title={salvando ? "Salvando..." : "Salvar"}
                            onPress={handleSalvar}
                            disabled={salvando}
                            flex
                        />
                    </>
                ) : (
                    <>
                        <ButtonLight
                            title="Voltar"
                            onPress={() => router.replace(`/imovel/${id}`)}
                            flex
                        />
                        <ButtonDark
                            title="Editar"
                            onPress={() => setIsEditable(true)}
                            flex
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
        paddingBottom: 40,
    },
    areaLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    textoLoading: {
        marginTop: 10,
        color: COLORS.darkBlue,
        fontStyle: 'italic'
    },
    areaTitulo: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    linha: {
        width: '25%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 15,
    },
    titulo: {
        fontSize: FONT_SIZE.xlarge,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
    },
    areaFormulario: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20
    },
    areaTipoStatus: {
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
        marginVertical: 10,
        marginLeft: 15
    },
    texto: {
        fontSize: FONT_SIZE.small,
        marginBottom: 10,
        color: COLORS.black,
    },
    areaCheckBox: {
        flexDirection: 'row',
        gap: 10
    },
    areaImg: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 15,
        alignItems: 'center',
        marginBottom: 10
    },
    areaBotoes: {
        flexDirection: 'row',
        width: '90%',
        gap: 10,
        marginTop: 10
    },
    fotoPrevia: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.grey,
    },
    textoSemFoto: {
        fontSize: FONT_SIZE.small,
        color: COLORS.grey,
        fontStyle: 'italic',
        marginVertical: 15,
    }
});