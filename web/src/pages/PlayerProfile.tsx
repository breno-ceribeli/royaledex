import { useParams } from 'react-router-dom'

export function PlayerProfile() {
  const { tag } = useParams<{ tag: string }>()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Jogador: #{tag}</h1>
      <p className="text-gray-600">
        O perfil do jogador será implementado aqui...
      </p>
      {/* TODO: Implementar perfil do jogador com dados da API */}
    </div>
  )
}
