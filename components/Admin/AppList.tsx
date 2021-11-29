import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { FiX } from 'react-icons/fi'
import { AiOutlineSetting } from 'react-icons/ai'

import { App } from 'types/app'
import { Manager } from 'types/manager'
import { submitDeleteApp } from 'requests'
import useNotificationStore from 'store/notification'

import AppModal from './AppModal'
import Input from 'components/Input'
import ManageTable from './ManageTable'
import AppListing from 'components/AppListing'
import { confirm } from 'components/ConfirmModal'

type Props = {
  apps: App[]
  filterManager: string
  managers: Manager[]
  triggerAppsUpdate: (apps: App[]) => void
}

const AppList: FC<Props> = ({ apps, filterManager, managers, triggerAppsUpdate }) => {
  const notify = useNotificationStore((state) => state.notify)
  const [editApps, setEditApps] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [appToEdit, setAppToEdit] = useState<App | null>(null)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  const handleEditRequest = (app: Manager | App) => {
    setAppToEdit(app as App)
    setEditModalOpen(true)
  }

  const handleDeleteRequest = async (app: Manager | App) => {
    if (await confirm('Are you sure you want to delete the app?')) {
      const data = await submitDeleteApp((app as App).id || '')
      if (data.apps) {
        triggerAppsUpdate(data.apps)
      }
      if (data.message) {
        notify(data.message)
      }
    }
  }

  const handleSearching = (event: FormEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value)
  }

  const appFilter = (app: App) =>
    (!filterManager.length || app.managerId === filterManager) &&
    app.name.toLowerCase().includes(searchQuery.toLowerCase())

  return (
    <>
      <div className="flex flex-col space-y-3 my-6">
        <div className="flex justify-between items-center">
          <h2 className="uppercase text-xs font-semibold text-gray-500 tracking-wider">Apps</h2>
          {apps.length ? (
            <button
              className="flex items-center py-2 px-3 space-x-2 text-sm font-semibold text-gray-800 border border-gray-800 rounded-xl transition-all hover:bg-gray-200"
              onClick={() => setEditApps((curr) => !curr)}
            >
              {editApps ? <FiX size={20} /> : <AiOutlineSetting size={20} />}
              <span>{editApps ? 'Close' : 'Manage'}</span>
            </button>
          ) : null}
        </div>
        <Input
          type="text"
          placeholder="Search an app by its name"
          className="mb-5"
          onChange={handleSearching}
        />
        {editApps ? (
          <ManageTable
            list={apps.filter(appFilter)}
            editItem={handleEditRequest}
            deleteItem={handleDeleteRequest}
          />
        ) : (
          <AppListing items={apps.filter(appFilter)} loading={false} />
        )}
      </div>
      <AppModal
        app={appToEdit}
        isOpen={editModalOpen}
        managers={managers}
        close={() => setEditModalOpen(false)}
        triggerAppsUpdate={triggerAppsUpdate}
      />
    </>
  )
}

export default AppList
