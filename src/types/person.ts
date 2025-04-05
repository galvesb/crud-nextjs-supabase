export interface Person {
  id: number
  name: string
  cpf: string
  created_at?: string
}

export interface PersonInput {
  name: string
  cpf: string
}
