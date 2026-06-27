import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconCadastrarImovel, IconPerfil, IconPrincipal } from '../../src/components/Icons';
import { COLORS } from '../../src/theme/colors';
import { FONT_SIZE } from '../../src/theme/typography';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.white,
                tabBarInactiveTintColor: COLORS.gray,
                tabBarLabelStyle: {
                    marginTop: 6,
                    fontSize: FONT_SIZE.small,
                },
                tabBarStyle: {
                    backgroundColor: COLORS.darkBlue,
                    borderTopWidth: 0,
                    paddingTop: 8,
                    height: 80,
                    paddingBottom: 8,
                },
                headerShown: true,
                headerStyle: {
                    backgroundColor: COLORS.darkBlue,
                    height: 100,

                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: FONT_SIZE.large,
                    marginBottom: 10,
                },
                headerTitleAlign: 'center'
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: 'Principal',
                    tabBarIcon: ({ focused, color }) => (
                        <IconPrincipal color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="cadastrar-imovel"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Cadastrar',
                    tabBarIcon: ({ color }) => (
                        <IconCadastrarImovel color={color} bgColor={COLORS.darkBlue} />
                    ),
                }}
            />

            <Tabs.Screen
                name="perfil"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <IconPerfil color={color} />
                    ),
                }}
            />

            {/* Oculta as pastas/rotas dinâmicas de imovel da barra, mas mantém a navegação aninhada */}
            <Tabs.Screen
                name="imovel/[id]"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="locacao/cadastrar-locacao"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="locacao/editar-locacao"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="locacao/historico-locacao"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="locacao/detalhes-locacao"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="imovel/fluxo-hospedes"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="imovel/financeiro"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="proprietario/cadastrar-proprietario"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="imovel/editar-imovel"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="proprietario/editar-proprietario"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="inquilino/cadastrar-inquilino"
                options={{
                    href: null,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="inquilino/editar-inquilino"
                options={{
                    href: null,
                    headerShown: false
                }}
            />




        </Tabs>
    );
}