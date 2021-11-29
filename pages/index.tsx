import { useEffect, useState } from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'
import type { FormEvent } from 'react'
import { FiClipboard } from 'react-icons/fi'
import { BsFillTerminalFill } from 'react-icons/bs'
import { RiLightbulbFlashLine } from 'react-icons/ri'

import type { App } from 'types/app'
import type { Manager } from 'types/manager'
import useCollectionStore from 'store/collection'
import useNotificationStore from 'store/notification'
import { getAppsForManager, getManagers } from 'requests'

import Modal from 'components/Modal'
import Layout from 'components/Layout'
import AppListing from 'components/AppListing'
import YourData from 'components/Home/YourData'
import ManagerListing from 'components/ManagerListing'
import SuggestAppModal from 'components/Home/SugestAppModal'

const Home: NextPage = () => {
  const [apps, setApps] = useState<App[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [apploading, setAppLoading] = useState<boolean>(true)
  const [suggestApp, setSuggestApp] = useState<boolean>(false)
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [selectedManager, setSelectedManager] = useState<string>('')
  const [terminalCommand, setTerminalCommand] = useState<string>('')
  const [managerLoading, setManagerLoading] = useState<boolean>(true)
  const [selectedCollection, setSelectedCollection] = useState<string>('default')
  const notify = useNotificationStore((state) => state.notify)
  const collections = useCollectionStore((state) => state.collections)
  const addAppToCollection = useCollectionStore((state) => state.addAppToCollection)
  const removeAppFromCollection = useCollectionStore((state) => state.removeAppFromCollection)
  const stateCollection = collections.find((collection) => collection.id === selectedCollection)

  const getManagersFromAPI = async () => {
    setManagerLoading(true)
    const data = await getManagers()

    if (data.managers) {
      setManagers(data.managers)
      setSelectedManager(data.managers[0]?.id || '')
    }
    if (data.message) {
      notify(data.message)
    }
    setManagerLoading(false)
  }

  useEffect(() => {
    getManagersFromAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAppsFromAPI = async (managerId: string) => {
    setAppLoading(true)
    const data = await getAppsForManager(managerId)

    if (data.apps) {
      setApps(data.apps)
    }
    if (data.message) {
      notify(data.message)
    }
    setAppLoading(false)
  }

  useEffect(() => {
    if (selectedManager.length) {
      getAppsFromAPI(selectedManager)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedManager])

  useEffect(() => {
    if (selectedManager.length) {
      const managerIndex = stateCollection?.data.findIndex(
        (collItem) => collItem.managerId === selectedManager
      )
      if (managerIndex !== undefined && managerIndex > -1) {
        setSelectedApps(stateCollection?.data[managerIndex].apps || [])
      } else {
        setSelectedApps([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managers, selectedManager, stateCollection])

  const toggleSelectedApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      removeAppFromCollection(selectedCollection, selectedManager, appId)
      setSelectedApps((selected) => selected.filter((a) => a !== appId))
    } else {
      addAppToCollection(selectedCollection, selectedManager, appId)
      setSelectedApps((selected) => [...selected, appId])
    }
  }

  const generateTerminalCommand = () => {
    const manager = managers.find((manager) => manager.id === selectedManager)
    const selectedAppsData = apps.filter((app) => app.id && selectedApps.includes(app.id))
    if (manager) {
      let command = manager.command
      for (const app of selectedAppsData) {
        command += ` ${app.packageName}`
      }

      setTerminalCommand(command)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(terminalCommand)
    notify('Copied to your clipboard')
  }

  const handleCloseSuggestionSuccess = (message: string) => {
    notify(message)
    setSuggestApp(false)
  }

  const handleSearching = (event: FormEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value)
  }

  const appFilter = (app: App) =>
    app.managerId === selectedManager && app.name.toLowerCase().includes(searchQuery.toLowerCase())

  return (
    <>
      <Head>
        <title> Bootstrap</title>
      </Head>
      <Layout>
        <YourData collection={stateCollection} setCollection={setSelectedCollection} />
        <div className="relative mt-52">
          <div className="w-full lg:w-4/5 mx-auto">
            <ManagerListing
              onClickAction={setSelectedManager}
              activeItem={[selectedManager]}
              items={managers}
              loading={managerLoading}
            />
          </div>
          <div className="flex flex-col mt-6">
            <h2 className="uppercase text-sm font-semibold text-gray-800 tracking-wider mb-3">
              Selected Apps
            </h2>
            <AppListing
              onClickAction={toggleSelectedApp}
              items={apps}
              activeItem={selectedApps}
              selectedApps={selectedApps}
              loading={apploading}
            />
          </div>
          <div className="flex flex-col mt-6">
            <h2 className="uppercase text-sm font-semibold text-gray-800 tracking-wider mb-3">
              Available Apps
            </h2>
            <div className="flex justify-between items-center mb-5">
              <input
                type="text"
                placeholder="Search an app by its name"
                className="w-2/5 rounded-xl py-3 px-4 border-2 border-gray-300 transition-all focus:border-gray-800 outline-none"
                onChange={handleSearching}
              />
              <button
                onClick={() => setSuggestApp(true)}
                className="flex justify-center items-center py-3 px-10 rounded-xl bg-gray-800 text-white transition-all hover:bg-gray-700 space-x-2 text-sm font-semibold"
              >
                <RiLightbulbFlashLine size={22} />
                <span>Suggest app</span>
              </button>
            </div>
            <AppListing
              onClickAction={toggleSelectedApp}
              activeItem={selectedApps}
              items={apps.filter(appFilter)}
              loading={apploading}
            />
          </div>
          {selectedApps.length ? (
            <div className="fixed bottom-8 left-0 w-full flex justify-center">
              <button
                onClick={generateTerminalCommand}
                className="bg-gray-800 px-6 py-4 flex justify-center items-center text-white transition-all shadow-lg hover:shadow-none hover:brightness-150 space-x-3 font-semibold tracking-wide rounded-2xl border-2 border-white"
              >
                <BsFillTerminalFill size={30} />
                <span>Generate command</span>
              </button>
            </div>
          ) : null}
        </div>
      </Layout>
      <SuggestAppModal
        isOpen={suggestApp}
        managers={managers}
        close={() => setSuggestApp(false)}
        closeSuccess={handleCloseSuggestionSuccess}
      />
      <Modal
        isOpen={!!terminalCommand.length}
        close={() => setTerminalCommand('')}
        title="Terminal command generated"
      >
        <code className="bg-gray-800 p-3 max-h-36 text-gray-200 mb-6 block overflow-y-scroll break-words">
          {terminalCommand}
        </code>
        <div className="w-full flex justify-center">
          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="uppercase bg-white border border-gray-800 text-gray-800 py-3 text-sm tracking-wider px-6 transition-all flex items-center space-x-2 hover:bg-gray-800 font-semibold hover:text-white rounded-xl"
          >
            <FiClipboard size={20} />
            <span>Copy to Clipboard</span>
          </button>
        </div>
      </Modal>
    </>
  )
}

export default Home
