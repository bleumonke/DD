import { useEffect, useState } from 'react'
import type { Price, Layout } from '../../../types'
import Select from 'react-select'
import { MdAttachMoney, MdCalendarMonth } from 'react-icons/md'
import { FaSeedling } from 'react-icons/fa'
import './PricingForm.css'


function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  name: keyof Price
  type?: string
  value: string | number | undefined
  onChange: (name: keyof Price, value: string | number) => void
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={(e) =>
          onChange(name, type === 'number' ? parseFloat(e.target.value) : e.target.value)
        }
      />
    </div>
  )
}

function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="form-card">
      <h3>
        <Icon className="section-icon" /> {title}
      </h3>
      <div className="form-grid">{children}</div>
    </div>
  )
}

type Props = {
  pricing: Price
  layouts: Layout[]
  onSave: (updated: Price) => void
  isNew?: boolean
}

export default function PricingForm({ pricing, onSave, layouts, isNew = false }: Props) {
  const [formData, setFormData] = useState<Price>(pricing)

  useEffect(() => {
    setFormData(pricing)
  }, [pricing])

  const handleChange = (name: keyof Price, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLayoutChange = (selected: any) => {
    handleChange('layout', selected?.value || '')
  }

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.layout?.trim() || !formData.crop?.trim()) {
      alert('Name, Layout, and Crop are required.')
      return
    }
    onSave(formData)
  }

  const layoutOptions = layouts.map(layout => ({
    value: layout.id,
    label: layout.name,
  }))

  return (
    <div className="pricing-form">
      <FormSection icon={FaSeedling} title="Basic Info">
        <InputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <div className="form-field">
          <label htmlFor="layout">Layout</label>
          <Select
            id="layout"
            name="layout"
            options={layoutOptions}
            value={layoutOptions.find(opt => opt.value === formData.layout) || null}
            onChange={handleLayoutChange}
            placeholder="Select a layout..."
            classNamePrefix="react-select"
          />
        </div>
        <InputField
          label="Crop"
          name="crop"
          value={formData.crop}
          onChange={handleChange}
        />
      </FormSection>

      <FormSection icon={MdAttachMoney} title="Pricing Details">
        <InputField
          label="Price per Acre"
          name="pricePerAcre"
          type="number"
          value={formData.pricePerAcre}
          onChange={handleChange}
        />
        <InputField
          label="Min Size (Acres)"
          name="minSize"
          type="number"
          value={formData.minSize}
          onChange={handleChange}
        />
        <InputField
          label="Max Size (Acres)"
          name="maxSize"
          type="number"
          value={formData.maxSize}
          onChange={handleChange}
        />
      </FormSection>

      <FormSection icon={MdCalendarMonth} title="Validity Period">
        <InputField
          label="Valid From"
          name="validFrom"
          type="date"
          value={formData.validFrom}
          onChange={handleChange}
        />
        <InputField
          label="Valid To"
          name="validTo"
          type="date"
          value={formData.validTo}
          onChange={handleChange}
        />
      </FormSection>

      <div className="form-buttons">
        <button className="btn save" onClick={handleSave}>
          {isNew ? 'Create' : 'Update'}
        </button>
      </div>
    </div>
  )
}
