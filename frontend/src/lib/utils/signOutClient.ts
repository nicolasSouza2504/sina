export default function signOutClient() {
    // Limpa todos os dados do localStorage relacionados à autenticação
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        
        // Limpa também o sessionStorage que pode conter dados temporários
        sessionStorage.clear();
        
        console.log('Client-side sign out completed: localStorage and sessionStorage cleared');
    }
}