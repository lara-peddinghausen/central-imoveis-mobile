// Responsável por:
// login
// cadastro
// refresh token
// recuperação de senha
// logout
// chamadas de autenticação

export async function login(email, senha) {
    // Simula um pequeno atraso de rede
    // await new Promise(resolve => setTimeout(resolve, 500)); 
    
    return email === 'teste@gmail.com' && senha === '123';
}