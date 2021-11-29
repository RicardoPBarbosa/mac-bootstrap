import { useState } from 'react'
import type { FC, SyntheticEvent } from 'react'

import hasErrors from 'utils/check-errors'
import validateFields from 'utils/validate-fields'
import { submitNewSuggestion } from 'requests'
import { Manager } from 'types/manager'
import { ErrorProps, FormInputs } from 'types/form'
import useNotificationStore from 'store/notification'

import Modal from 'components/Modal'
import Input from 'components/Input'
import ManagerCheckbox from 'components/ManagerCheckbox'

type Props = {
  isOpen: boolean
  close: () => void
  managers: Manager[]
  closeSuccess: (message: string) => void
}

const Label: FC<{ error?: boolean }> = ({ error, children }) => (
  <p className={`text-sm text-gray-500 font-semibold mb-2 ${error ? 'text-red-400' : ''}`}>
    {children}
  </p>
)

const SuggestAppModal: FC<Props> = ({ isOpen, close, managers, closeSuccess }) => {
  const notify = useNotificationStore((state) => state.notify)
  const [selectedManager, setSelectedManager] = useState<string>('')
  const [errors, setErrors] = useState<ErrorProps>({
    selectedManager: '',
    name: '',
    logo: '',
    packageName: '',
  })

  const handleClose = () => {
    setSelectedManager('')
    setErrors({ selectedManager: '', name: '', logo: '', packageName: '' })
    close()
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target & FormInputs
    const name = target.name.value
    const logo = target.logo.value
    const packageName = target.packageName.value

    const errors = validateFields({ selectedManager, name, logo, packageName })
    if (hasErrors(errors as ErrorProps)) {
      setErrors(errors as ErrorProps)
      return
    }

    const response = await submitNewSuggestion({
      name,
      logo,
      packageName,
      managerId: selectedManager,
    })
    if (!response.ok) {
      notify(
        response.message || 'An error occurred while submitting your suggestion. Please try again.'
      )
      return
    }
    closeSuccess('Suggestion submitted successfully')
  }

  return (
    <>
      <Modal isOpen={isOpen} close={handleClose} title="Suggest App">
        <form onSubmit={handleSubmit}>
          <Label error={!!errors.selectedManager?.length}>Package manager it belongs to *</Label>
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
          <Label error={!!errors.name?.length}>Name *</Label>
          <Input type="text" name="name" placeholder="Ex: Google Chrome" className="mb-5" />
          <Label error={!!errors.logo?.length}>URL of a PNG image of the app logo *</Label>
          <Input
            type="text"
            name="logo"
            placeholder="Ex: https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png"
            className="mb-5"
          />
          <Label error={!!errors.packageName?.length}>
            Name of the app on the package manager library *
          </Label>
          <Input type="text" name="packageName" placeholder="Ex: chrome" className="mb-5" />
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="bg-gray-800 text-white py-3 text-sm tracking-wider font-medium px-6 transition-all hover:bg-gray-700 rounded-xl"
            >
              Submit suggestion
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default SuggestAppModal
