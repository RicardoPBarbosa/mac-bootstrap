export type App = {
  id?: string
  name: string
  logo?: string
  packageName: string
  managerId: string
}

export type SuggestedAppItem = App & { manager: string }
