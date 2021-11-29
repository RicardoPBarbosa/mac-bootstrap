import { FC } from 'react'

import useNotificationStore from 'store/notification'

const Notification: FC = () => {
  const message = useNotificationStore((state) => state.message)

  return message.length ? (
    <div className="fixed top-2 left-0 w-full flex justify-center z-20">
      <div className="w-max bg-gray-800 border-2 border-white text-white rounded-lg py-3 px-5 font-semibold text-sm tracking-wide shadow-xl">
        {message}
      </div>
    </div>
  ) : null
}

export default Notification
