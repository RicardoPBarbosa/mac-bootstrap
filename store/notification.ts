/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { devtools } from 'zustand/middleware'
import create, { GetState, SetState, StateCreator, StoreApi } from 'zustand'

import { NotificationState } from 'types/store'

const log =
  (config: StateCreator<NotificationState>) =>
    (
      set: SetState<NotificationState>,
      get: GetState<NotificationState>,
      api: StoreApi<NotificationState>
    ) =>
      config(
        (args) => {
          set(args)
          if (process.env.NODE_ENV !== 'production') {
            console.log('🐻 notification state', get().message)
          }
        },
        get,
        api
      )

const useNotificationStore = create<NotificationState>(
  devtools(
    log(
      (set) => ({
        message: '',
        notify: (message: string) => {
          set(() => ({ message }))
          setTimeout(() => {
            set(() => ({ message: '' }))
          }, 3000);
        },
      }),
    )
  )
)

export default useNotificationStore
