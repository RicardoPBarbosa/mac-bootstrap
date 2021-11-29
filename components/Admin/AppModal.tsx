import { useEffect, useState } from 'react'
import type { FC, SyntheticEvent } from 'react'

import { App } from 'types/app'
import { Manager } from 'types/manager'
import { submitEditApp, submitNewApp } from 'requests'
import useNotificationStore from 'store/notification'

import Modal from 'components/Modal'
import Input from 'components/Input'
import ManagerCheckbox from 'components/ManagerCheckbox'

type Props = {
  isOpen: boolean
  close: () => void
  managers: Manager[]
  app?: App | null
  triggerAppsUpdate: (apps: App[]) => void
}

const Label: FC = ({ children }) => (
  <p className="text-sm text-gray-500 font-semibold mb-2">{children}</p>
)

type FormInputs = {
  name: { value: string }
  logo: { value: string }
  packageName: { value: string }
}

const AppModal: FC<Props> = ({ isOpen, close, managers, app, triggerAppsUpdate }) => {
  const notify = useNotificationStore((state) => state.notify)
  const [selectedManager, setSelectedManager] = useState<string>('')

  useEffect(() => {
    if (app) {
      setSelectedManager(app.managerId)
    }
  }, [app])

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & FormInputs
    const name = target.name.value
    const logo = target.logo.value
    const packageName = target.packageName.value

    if (!name.trim().length || !selectedManager || !packageName.trim().length) {
      return
    }

    if (app) {
      const data = await submitEditApp({
        id: app.id,
        name,
        logo,
        packageName,
        managerId: selectedManager,
      })
      if (data.apps) {
        triggerAppsUpdate(data.apps)
      }
      if (data.message) {
        notify(data.message)
      }
      setSelectedManager('')
      close()
      return
    }
    const data = await submitNewApp({ name, logo, packageName, managerId: selectedManager })
    if (data.apps) {
      triggerAppsUpdate(data.apps)
    }
    if (data.message) {
      notify(data.message)
    }
    setSelectedManager('')
  }

  return (
    <Modal isOpen={isOpen} close={close} title={app ? 'Edit App' : 'New App'}>
      <form onSubmit={handleSubmit}>
        <Label>Package manager it belongs to</Label>
        <div className="grid grid-flow-row grid-cols-3 gap-2 mb-3">
          {managers.map((manager) => (
            <ManagerCheckbox
              key={manager.id}
              manager={manager}
              selected={selectedManager === manager.id}
              onClick={() => setSelectedManager(manager.id || '')}
            />
          ))}
        </div>
        <Label>Name</Label>
        <Input
          type="text"
          name="name"
          placeholder="Ex: Google Chrome"
          className="mb-5"
          defaultValue={app ? app.name : ''}
        />
        <Label>URL of a PNG image of the app logo</Label>
        <Input
          type="text"
          name="logo"
          placeholder="Ex: https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png"
          className="mb-5"
          defaultValue={app ? app.logo : ''}
        />
        <Label>Name of the app on the package manager library</Label>
        <Input
          type="text"
          name="packageName"
          placeholder="Ex: chrome"
          className="mb-5"
          defaultValue={app ? app.packageName : ''}
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

export default AppModal
