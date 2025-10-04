import { useState, useEffect } from 'react'
import { MdDiscount, MdCalendarMonth } from 'react-icons/md'
import { FaClipboardList } from 'react-icons/fa'
import type { Coupon } from '../../../types'
import './CouponForm.css'

type Props = {
  coupon: Coupon
  onSave: (updated: Coupon) => void
  onCancel?: () => void
  isNew: boolean
}

export default function CouponForm({ coupon, onSave, onCancel, isNew }: Props) {
  const [formData, setFormData] = useState<Coupon>(coupon)

  useEffect(() => {
    setFormData(coupon)
  }, [coupon])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    let parsedValue: any = value
    if (['discountValue', 'usageLimit', 'usedCount'].includes(name)) {
      parsedValue = value === '' ? 0 : Number(value)
      if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }))
  }

  const handleSave = () => {
    if (!formData.code.trim()) {
      alert('Code is required.')
      return
    }
    if (!formData.discountType) {
      alert('Discount Type is required.')
      return
    }
    if (formData.discountValue <= 0) {
      alert('Discount Value must be greater than 0.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="coupon-form">
      {/* Coupon Details */}
      <div className="form-card">
        <h3 className="form-header">
          <MdDiscount className="section-icon" /> Coupon Details
        </h3>
        <div className="form-grid">
          {[
            { label: 'Code', name: 'code' },
            { label: 'Description', name: 'description' },
          ].map(({ label, name }) => (
            <div className="form-field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name as keyof Coupon] || ''}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Discount Type Dropdown */}
          <div className="form-field">
            <label htmlFor="discountType">Discount Type</label>
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="">Select Discount Type</option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="form-field">
            <label htmlFor="discountValue">Discount Value</label>
            <input
              type="number"
              min={0}
              step="0.01"
              id="discountValue"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Validity Period */}
      <div className="form-card">
        <h3 className="form-header">
          <MdCalendarMonth className="section-icon" /> Validity
        </h3>
        <div className="form-grid">
          {[
            { label: 'Valid From', name: 'validFrom' },
            { label: 'Valid To', name: 'validTo' },
          ].map(({ label, name }) => (
            <div className="form-field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                type="date"
                id={name}
                name={name}
                value={formData[name as keyof Coupon] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Usage Limits */}
      <div className="form-card">
        <h3 className="form-header">
          <FaClipboardList className="section-icon" /> Usage
        </h3>
        <div className="form-grid">
          {[
            { label: 'Usage Limit', name: 'usageLimit' },
            { label: 'Used Count', name: 'usedCount' },
          ].map(({ label, name }) => (
            <div className="form-field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                type="number"
                min={0}
                id={name}
                name={name}
                value={formData[name as keyof Coupon]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-buttons">
        <button className="btn save" onClick={handleSave}>
          {isNew ? 'Create' : 'Update'}
        </button>
        {onCancel && (
          <button className="btn cancel" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}