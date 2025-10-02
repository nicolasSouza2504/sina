export default function Loading(){
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-600">Carregando tela de administração de alunos...</p>
        </div>
    )
}