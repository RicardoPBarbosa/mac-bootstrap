import { App } from 'types/app'
import { Manager } from 'types/manager'

const sortByName = (a: Manager | App, b: Manager | App): number => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1
  }
  return 0
}

export default sortByName
