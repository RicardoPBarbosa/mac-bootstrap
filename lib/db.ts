import firestore from 'lib/firestore'

import { App } from 'types/app'
import { Manager } from 'types/manager'

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T,
})

const dataPoint = <T>(collectionPath: string) =>
  firestore.collection(collectionPath).withConverter(converter<T>())

const db = {
  apps: dataPoint<App>('apps'),
  managers: dataPoint<Manager>('managers'),
  suggestions: dataPoint<App>('suggestions'),
}

export { db }
