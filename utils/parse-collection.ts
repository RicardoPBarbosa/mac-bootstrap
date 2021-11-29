import { Collection } from 'types/shared'

const parseStateCollection = (contents: string): Collection[] | null => {
  try {
    const parsed = JSON.parse(contents as string)

    if (
      parsed.collections &&
      Array.isArray(parsed.collections) &&
      parsed.collections.length &&
      parsed.collections[0].id &&
      Array.isArray(parsed.collections[0].data) &&
      parsed.collections[0].data[0].managerId &&
      Array.isArray(parsed.collections[0].data[0].apps)
    ) {
      return parsed.collections as Collection[]
    }

    return null
  } catch (error) {
    return null
  }
}

export default parseStateCollection
