import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { App } from 'types/app'
import { Manager } from 'types/manager'
import { useAuth } from 'hooks/useAuthUser'
import useNotificationStore from 'store/notification'
import { getAppsForManager, getManagers, getSuggestionCount } from 'requests'

import Layout from 'components/Layout'
import AppList from 'components/Admin/AppList'
import AppModal from 'components/Admin/AppModal'
import ManagerList from 'components/Admin/ManagerList'
import ManagerModal from 'components/Admin/ManagerModal'

const Admin: NextPage = () => {
  const [apps, setApps] = useState<App[]>([])
  const [newApp, setNewApp] = useState<boolean>(false)
  const [managers, setManagers] = useState<Manager[]>([])
  const [newManager, setNewManager] = useState<boolean>(false)
  const [filterManager, setFilterManager] = useState<string>('')
  const [suggestionCount, setSuggestionCount] = useState<number>(0)
  const router = useRouter()
  const { authUser, loading, signOut } = useAuth()
  const notify = useNotificationStore((state) => state.notify)

  const getManagersFromAPI = async () => {
    const data = await getManagers()

    if (data.managers) {
      setManagers(data.managers)
    }
    if (data.message) {
      notify(data.message)
    }
  }

  const getAppsFromAPI = async (managerId: string) => {
    const data = await getAppsForManager(managerId)

    if (data.apps) {
      setApps(data.apps)
    }
    if (data.message) {
      notify(data.message)
    }
  }

  const getSuggestionCountFromAPI = async () => {
    const data = await getSuggestionCount()

    if (data.count !== undefined) {
      setSuggestionCount(data.count)
    }
    if (data.message) {
      notify(data.message)
    }
  }

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/admin/auth')
    }
    if (!loading && authUser) {
      getManagersFromAPI()
      getAppsFromAPI('ALL')
      getSuggestionCountFromAPI()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, authUser, loading])

  const triggerAppsUpdate = (newAppsBatch: App[]) => {
    setApps(newAppsBatch)
    setNewApp(false)
    setFilterManager('')
  }

  const triggerManagersUpdate = (newManagersBatch: Manager[]) => {
    setManagers(newManagersBatch)
    setNewManager(false)
    setFilterManager('')
  }

  if (!authUser) {
    return null
  }

  return (
    <>
      <Head>
        <title> Bootstrap - Admin</title>
      </Head>
      <Layout user={authUser} signOut={signOut}>
        <div className="flex items-center space-x-2">
          <button
            className="flex-1 h-14 flex justify-center items-center tracking-wide text-sm font-semibold text-white bg-gray-700 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-none"
            onClick={() => setNewManager(true)}
          >
            New package manager
          </button>
          <button
            className="flex-1 h-14 flex justify-center items-center tracking-wide text-sm font-semibold text-white bg-gray-700 shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:shadow-none"
            onClick={() => setNewApp(true)}
          >
            New app
          </button>
          <Link href="/admin/suggestions" passHref>
            <a
              className="flex-1 px-5 h-14 flex justify-center items-center tracking-wide text-sm font-semibold text-gray-800 bg-white border-2 border-gray-800 shadow-lg rounded-2xl space-x-2 transition-all duration-300 ease-in-out hover:shadow-none"
              href="#"
            >
              <span>Suggestions</span>
              <span className="rounded-full w-6 h-6 flex justify-center items-center bg-gray-300 text-gray-800 font-semibold text-xs">
                {suggestionCount}
              </span>
            </a>
          </Link>
        </div>
        <ManagerList
          filterManager={filterManager}
          setFilterManager={setFilterManager}
          managers={managers}
          triggerManagersUpdate={triggerManagersUpdate}
          triggerAppsUpdate={triggerAppsUpdate}
        />
        <AppList
          apps={apps}
          filterManager={filterManager}
          managers={managers}
          triggerAppsUpdate={triggerAppsUpdate}
        />
      </Layout>
      <ManagerModal
        isOpen={newManager}
        close={() => setNewManager(false)}
        triggerManagersUpdate={triggerManagersUpdate}
      />
      <AppModal
        isOpen={newApp}
        close={() => setNewApp(false)}
        managers={managers}
        triggerAppsUpdate={triggerAppsUpdate}
      />
    </>
  )
}

export default Admin
