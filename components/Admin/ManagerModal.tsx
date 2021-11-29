import type { FC, SyntheticEvent } from 'react'

import { Manager } from 'types/manager'
import useNotificationStore from 'store/notification'
import { submitEditManager, submitNewManager } from 'requests'

import Input from 'components/Input'
import Modal from 'components/Modal'

type Props = {
  isOpen: boolean
  close: () => void
  triggerManagersUpdate: (managers: Manager[]) => void
  manager?: Manager | null
}

const Label: FC = ({ children }) => (
  <p className="text-sm text-gray-500 font-semibold mb-2">{children}</p>
)

type FormInputs = {
  name: { value: string }
  logo: { value: string }
  command: { value: string }
  installCommand: { value: string }
}

const ManagerModal: FC<Props> = ({ isOpen, close, triggerManagersUpdate, manager }) => {
  const notify = useNotificationStore((state) => state.notify)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const target = e.target as typeof e.target & FormInputs
    const name = target.name.value
    const logo = target.logo.value
    const command = target.command.value
    const installCommand = target.installCommand.value

    if (
      !name.trim().length ||
      !logo.trim().length ||
      !command.trim().length ||
      !installCommand.trim().length
    ) {
      return
    }

    if (manager) {
      const data = await submitEditManager({ id: manager.id, name, logo, command, installCommand })
      if (data.managers) {
        triggerManagersUpdate(data.managers)
      }
      if (data.message) {
        notify(data.message)
      }
      close()
      return
    }
    const data = await submitNewManager({ name, logo, command, installCommand })
    if (data.managers) {
      triggerManagersUpdate(data.managers)
    }
    if (data.message) {
      notify(data.message)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      title={manager ? 'Edit Package Manager' : 'New Package Manager'}
    >
      <form onSubmit={handleSubmit}>
        <Label>Name</Label>
        <Input
          type="text"
          name="name"
          placeholder="Ex: Homebrew"
          className="mb-5"
          defaultValue={manager ? manager.name : ''}
        />
        <Label>URL of a PNG image of the package manager logo</Label>
        <Input
          type="text"
          name="logo"
          placeholder="Ex: https://upload.wikimedia.org/wikipedia/commons/3/34/Homebrew_logo.png"
          className="mb-5"
          defaultValue={manager ? manager.logo : ''}
        />
        <Label>Terminal command</Label>
        <Input
          type="text"
          name="command"
          placeholder="Ex: brew install"
          className="mb-5"
          defaultValue={manager ? manager.command : ''}
        />
        <Label>Manager installation</Label>
        <Input
          type="text"
          name="installCommand"
          placeholder={`Ex: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`}
          className="mb-5"
          defaultValue={manager ? manager.installCommand : ''}
        />
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="uppercase bg-gray-800 text-white py-3 text-sm tracking-wider font-medium px-6 transition-all hover:bg-gray-700 rounded-xl"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ManagerModal
