import type { FC } from 'react'
import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { AiOutlineSetting, AiOutlineClear } from 'react-icons/ai'

import { App } from 'types/app'
import { Manager } from 'types/manager'
import { submitDeleteManager } from 'requests'
import useNotificationStore from 'store/notification'

import ManageTable from './ManageTable'
import ManagerModal from './ManagerModal'
import { confirm } from 'components/ConfirmModal'
import ManagerListing from 'components/ManagerListing'

type Props = {
  filterManager: string
  setFilterManager: (id: string) => void
  managers: Manager[]
  triggerManagersUpdate: (managers: Manager[]) => void
  triggerAppsUpdate: (apps: App[]) => void
}

const ManagerList: FC<Props> = ({
  filterManager,
  setFilterManager,
  managers,
  triggerManagersUpdate,
  triggerAppsUpdate,
}) => {
  const notify = useNotificationStore((state) => state.notify)
  const [editManagers, setEditManagers] = useState<boolean>(false)
  const [managerToEdit, setManagerToEdit] = useState<Manager | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleEditRequest = (manager: Manager | App) => {
    setManagerToEdit(manager as Manager)
    setModalOpen(true)
  }

  const handleDeleteRequest = async (manager: Manager | App) => {
    if (
      await confirm(
        'Are you sure you want to delete the package manager? All apps related to it will be deleted as well.'
      )
    ) {
      const data = await submitDeleteManager((manager as Manager).id || '')
      if (data.managers && data.apps) {
        triggerManagersUpdate(data.managers)
        triggerAppsUpdate(data.apps)
      }
      if (data.message) {
        notify(data.message)
      }
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-3 mt-7">
        <div className="flex justify-between items-center h-6">
          <div className="flex items-center space-x-5">
            <h2 className="uppercase text-xs font-semibold text-gray-500 tracking-wider">
              Package Managers
            </h2>
            {filterManager ? (
              <button
                className="flex items-center space-x-2 text-sm font-semibold text-red-400 transition-all hover:text-gray-800"
                onClick={() => setFilterManager('')}
              >
                <AiOutlineClear size={18} />
                <span>Clear Selection</span>
              </button>
            ) : null}
          </div>
          {managers.length ? (
            <button
              className="flex items-center py-2 px-3 space-x-2 text-sm font-semibold text-gray-800 border border-gray-800 rounded-xl transition-all hover:bg-gray-200"
              onClick={() => setEditManagers((curr) => !curr)}
            >
              {editManagers ? <FiX size={20} /> : <AiOutlineSetting size={20} />}
              <span>{editManagers ? 'Close' : 'Manage'}</span>
            </button>
          ) : null}
        </div>
        {editManagers ? (
          <ManageTable
            list={managers}
            editItem={handleEditRequest}
            deleteItem={handleDeleteRequest}
          />
        ) : (
          <ManagerListing
            items={managers}
            onClickAction={setFilterManager}
            activeItem={[filterManager]}
            loading={false}
          />
        )}
      </div>
      <ManagerModal
        manager={managerToEdit}
        isOpen={modalOpen}
        close={() => setModalOpen(false)}
        triggerManagersUpdate={triggerManagersUpdate}
      />
    </>
  )
}

export default ManagerList
