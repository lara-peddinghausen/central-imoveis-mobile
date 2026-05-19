import { Stack } from 'expo-router';

export default function Layout() {
    return (<Stack>
        <Stack.Screen
            name="login"
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name='home'
            // options={{ headerShown: false }}
            options={{
                
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0B3B63'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold'
                },
                headerTitleAlign: 'center'
            }}

        />


    </Stack>);
}