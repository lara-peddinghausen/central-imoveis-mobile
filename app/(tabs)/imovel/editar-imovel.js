import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../src/services/api';
import { COLORS } from '../../../src/theme/colors.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import InputItem from '../../../src/components/InputItem/index.js';
import CheckBox from '../../../src/components/CheckBox/index.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';
import ImageSelector from '../../../src/components/ImageSelector/index.js';

export default function EditarImovel() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

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
    
    // Guarda apenas o ID do proprietário para passar na rota de edição dele depois
    const [idProprietario, setIdProprietario] = useState(null);

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

            // Apenas memoriza se esse imóvel tem um proprietário vinculado
            if (imovel.proprietario?.id) {
                setIdProprietario(imovel.proprietario.id);
            } else {
                setIdProprietario(null);
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

    // Envia os dados atualizados usando Multipart/Form-Data
    const handleSalvar = async () => {
        if (salvando) return;
        setSubmitted(true);

        // Validação focada apenas nas regras do Imóvel
        const camposImovelInvalidos = !nome.trim() || !numero.trim();

        if (camposImovelInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios (*)');
            return;
        }

        try {
            setSalvando(true);

            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('tipoLocacao', tipoLocacao);
            formData.append('numero', numero);
            formData.append('complemento', complemento);

            if (foto && foto !== fotoOriginal) {
                const uriParts = foto.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('foto', {
                    uri: foto,
                    name: `imovel_editado_${Date.now()}.${fileType}`,
                    type: `image/${fileType}`
                });
            }

            // Faz o PUT focado unicamente na entidade Imóvel
            await api.put(`/imovel/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Alert.alert('Sucesso', 'Imóvel atualizado com sucesso!', [
                { text: 'OK', onPress: () => router.replace(`/imovel/${id}`) }
            ]);

        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
            Alert.alert('Erro', 'O servidor rejeitou as atualizações.');
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.loadingText}>Buscando dados do imóvel...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.titleArea}>
                <View style={styles.line} />
                <Text style={styles.title}>Editar Imóvel</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>

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

                <View style={styles.fieldContainer}>
                    <Text style={styles.text}>Tipo de locação: *</Text>
                    <View style={styles.checkBoxArea}>
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

                <View style={styles.fieldContainer}>
                    <Text style={styles.text}>Status do Imóvel: *</Text>
                    <View style={styles.checkBoxArea}>
                        <CheckBox
                            label="Disponível"
                            isSelected={status === 'DISPONIVEL'}
                            onPress={() => {}}
                            disabled={true}
                        />
                        <CheckBox
                            label="Alugado"
                            isSelected={status === 'ALUGADO'}
                            onPress={() => {}}
                            disabled={true}
                        />
                    </View>
                </View>

                <View style={styles.imageArea}>
                    <Text style={[styles.text, { alignSelf: 'flex-start', marginLeft: 5 }]}>Foto do Imóvel:</Text>
                    <ImageSelector
                        currentImage={foto}
                        onImageSelected={(uri) => isEditable && setFoto(uri)}
                    />
                </View>
            </View>

            {/*Área Dinâmica de Botões focada na navegação modular */}
            <View style={styles.buttonArea}>
                {isEditable ? (
                    <>
                        <ButtonDark
                            title={salvando ? "Salvando..." : "Salvar"}
                            onPress={handleSalvar}
                            disabled={salvando}
                            flex
                        />
                        <ButtonLight
                            title="Cancelar"
                            onPress={() => {
                                carregarImovel();
                                setIsEditable(false);
                            }}
                            flex
                        />
                    </>
                ) : (
                    <>
                        <ButtonDark
                            title="Editar"
                            onPress={() => setIsEditable(true)}
                            flex
                        />
                        {/* 👤 Só exibe o botão Proprietário se o imóvel possuir um ID de proprietário válido */}
                        {idProprietario && (
                            <ButtonDark
                                title="Proprietário"
                                onPress={() => router.push(`/proprietario/editar-proprietario?id=${idProprietario}`)}
                                flex
                            />
                        )}
                        <ButtonLight
                            title="Voltar"
                            onPress={() => router.replace(`/imovel/${id}`)}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.darkBlue,
        fontStyle: 'italic'
    },
    titleArea: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: '25%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 15,
    },
    title: {
        fontSize: FONT_SIZE.xlarge,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
    },
    formArea: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20
    },
    formTitle: {
        fontSize: FONT_SIZE.large,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    fieldContainer: {
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
        marginVertical: 10,
        marginLeft: 15
    },
    text: {
        fontSize: FONT_SIZE.small,
        marginBottom: 10,
        color: COLORS.black,
        fontWeight: 'bold'
    },
    checkBoxArea: {
        flexDirection: 'row',
        gap: 10
    },
    imageArea: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 15,
        alignItems: 'center',
        marginBottom: 10
    },
    buttonArea: {
        flexDirection: 'row',
        width: '90%',
        gap: 10,
        marginTop: 10
    }
});