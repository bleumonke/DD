import React from 'react'
import './TextField.css'

type TextFieldProps = {
  label?: string
  icon?: React.ReactNode
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  currencySymbol?: string
  type?: React.HTMLInputTypeAttribute
}

export default function TextField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  currencySymbol,
  type = 'text',
}: TextFieldProps) {
  const hasIcon = Boolean(icon)
  const hasCurrency = Boolean(currencySymbol)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
  }

  return (
    <div className="textfield-wrapper">
      {label && <label className="textfield-label">{label}</label>}

      <div
        className={`textfield-input-wrapper${hasIcon ? ' has-icon' : ''}${
          hasCurrency ? ' has-currency' : ''
        }`}
      >
        {icon && <span className="textfield-icon">{icon}</span>}

        <input
          className="textfield-input"
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
        />

        {currencySymbol && (
          <span className="textfield-currency-symbol">{currencySymbol}</span>
        )}
      </div>
    </div>
  )
}