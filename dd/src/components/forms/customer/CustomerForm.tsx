import { useEffect, useState } from 'react'
import type { Customer } from '../../../types'
import { IoHomeOutline } from "react-icons/io5"
import { RiContactsLine } from "react-icons/ri"
import './CustomerForm.css'

type Props = {
  customer: Customer
  onSave: (updated: Customer) => void
  isNew?: boolean
}

type Field = {
  label: string
  name: keyof Customer
  type?: string
}

const ContactFields: Field[] = [
  { label: 'Name', name: 'name' },
  { label: 'Email', name: 'email' },
  { label: 'Phone', name: 'phone' },
]

const AddressFields: Field[] = [
  { label: 'Address Line 1', name: 'addressline1' },
  { label: 'Address Line 2', name: 'addressline2' },
  { label: 'City', name: 'city' },
  { label: 'State', name: 'state' },
  { label: 'Zip', name: 'zip' },
  { label: 'Country', name: 'country' },
]

function InputField({
  field,
  value,
  onChange,
}: {
  field: Field
  value: string
  onChange: (name: keyof Customer, value: string) => void
}) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>{field.label}</label>
      <input
        id={field.name}
        name={field.name}
        type={field.type || 'text'}
        value={value || ''}
        onChange={e => onChange(field.name, e.target.value)}
      />
    </div>
  )
}

function FormSection({
  icon: Icon,
  title,
  fields,
  formData,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  fields: Field[]
  formData: Customer
  onChange: (name: keyof Customer, value: string) => void
}) {
  return (
    <div className="form-card">
      <h3><Icon className="section-icon" /> {title}</h3>
      <div className="form-grid">
        {fields.map(field => (
          <InputField
            key={field.name}
            field={field}
            value={formData[field.name] as string}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}

export default function CustomerForm({ customer, onSave, isNew = false }: Props) {
  const [formData, setFormData] = useState<Customer>(customer)

  useEffect(() => {
    setFormData(customer)
  }, [customer])

  const handleChange = (name: keyof Customer, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.email?.trim()) {
      alert('Name and Email are required.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="customer-form">
      <FormSection
        icon={RiContactsLine}
        title="Contact Information"
        fields={ContactFields}
        formData={formData}
        onChange={handleChange}
      />
      <FormSection
        icon={IoHomeOutline}
        title="Address Information"
        fields={AddressFields}
        formData={formData}
        onChange={handleChange}
      />
      <div className="form-buttons">
        <button className="btn save" onClick={handleSave}>
          {isNew ? 'Create' : 'Update'}
        </button>
      </div>
    </div>
  )
}
