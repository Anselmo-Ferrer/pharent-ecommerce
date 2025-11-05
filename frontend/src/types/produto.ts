export interface Produto {
  id_produto: number
  nome: string
  descricao?: string
  preco: number
  estoque: number
  imagem?: string
  tamanhos?: string[]
  categoria: {
    nome: string
  }
}