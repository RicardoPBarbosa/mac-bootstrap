import type { FC } from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'

import Modal from 'components/Modal'

type Props = ReactConfirmProps & {
  proceed: (bool: boolean) => void
  cancelLabel: string
  proceedLabel: string
}

const ConfirmModal: FC<Props> = ({ confirmation, show, proceed, cancelLabel, proceedLabel }) => (
  <Modal isOpen={show} close={() => proceed(false)} title="Confirm your action" closeBtn={false}>
    <p className="text-gray-800 mb-6">{confirmation}</p>
    <div className="w-full flex justify-end">
      <button
        type="button"
        onClick={() => proceed(false)}
        className="uppercase text-gray-800 border border-gray-800 py-3 text-sm tracking-wider font-medium px-6 mr-3 transition-all hover:bg-gray-200 rounded-xl"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={() => proceed(true)}
        className="uppercase bg-gray-800 text-white py-3 text-sm tracking-wider font-medium px-6 transition-all hover:bg-gray-700 rounded-xl"
      >
        {proceedLabel}
      </button>
    </div>
  </Modal>
)

export function confirm(
  confirmation: string,
  proceedLabel = 'Confirm',
  cancelLabel = 'Cancel',
  options = {}
) {
  return createConfirmation(confirmable(ConfirmModal))({
    confirmation,
    proceedLabel,
    cancelLabel,
    ...options,
  })
}
