import { useEffect, useState } from 'react'
import type { Layout } from '../../../types'
import { IoHomeOutline } from "react-icons/io5"
import { RiContactsLine } from "react-icons/ri"
import './LayoutForm.css'


type Props = {
  layout: Layout
  onSave: (updated: Layout) => void
}

type Field = {
  label: string
  name: keyof Layout
  type?: string
}


const BasicFields: Field[] = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Extent', name: 'extent', type: 'number' },
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
  onChange
}: {
  field: Field
  value: string | number
  onChange: (name: keyof Layout, value: string | number) => void
}) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>{field.label}</label>
      <input
        id={field.name}
        name={field.name}
        type={field.type || 'text'}
        value={value ?? ''}
        onChange={(e) => {
          const val = field.type === 'number' ? Number(e.target.value) : e.target.value
          onChange(field.name, val)
        }}
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
  formData: Layout
  onChange: (name: keyof Layout, value: string | number) => void
}) {
  return (
    <div className="form-card">
      <h3><Icon className="section-icon" /> {title}</h3>
      <div className="form-grid">
        {fields.map(field => (
          <InputField
            key={field.name}
            field={field}
            value={formData[field.name] ?? ''}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}

export default function LayoutForm({ layout, onSave }: Props) {
  const [formData, setFormData] = useState<Layout>(layout)

  useEffect(() => {
    setFormData(layout)
  }, [layout])

  const handleChange = (name: keyof Layout, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <FormSection
        icon={RiContactsLine}
        title="Basic Information"
        fields={BasicFields}
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
        <button type="submit" className="btn save">Save Layout</button>
      </div>
    </form>
  )
}
