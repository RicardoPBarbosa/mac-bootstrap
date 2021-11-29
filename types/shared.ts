export type Error = {
  message: string
}

export type CollectionItem = {
  managerId: string
  apps: string[]
}

export type Collection = {
  id: string
  name: string
  data: CollectionItem[]
}
