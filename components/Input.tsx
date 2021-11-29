import type { FC, InputHTMLAttributes } from 'react'

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full rounded-xl py-3 px-4 border-2 border-gray-300 transition-all focus:border-gray-800 outline-none ${props.className}`}
  />
)

export default Input
