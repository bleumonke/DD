import { useRef, useState, useEffect } from 'react'
import { CUSTOMER_TABLE_HEADERS } from '../data'
import { DataTable, Drawer } from '../components/export'
import CustomerForm from '../components/forms/customer/CustomerForm'
import { IoAddCircleOutline } from "react-icons/io5"
import { useCustomerStore } from '../store/useCustomerStore'

import type { DrawerRef } from '../components/Drawer'
import type { ColumnDef } from '@tanstack/react-table'
import type { Customer } from '../types'


export default function Customers() {
  const [selectedRow, setSelectedRow] = useState<Customer | null>(null)
  const [isAddMode, setIsAddMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const customers = useCustomerStore((state) => state.customers)
  const addCustomer = useCustomerStore((state) => state.addCustomer)
  const deleteCustomer = useCustomerStore((state) => state.deleteCustomer)
  const updateCustomer = useCustomerStore((state) => state.updateCustomer)

  const drawerRef = useRef<DrawerRef>(null)

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      drawerRef.current.triggerOpen()
    }
  }, [drawerOpen])

  const handleSave = (data: Customer) => {
    if (isAddMode) {
      addCustomer({ ...data, id: crypto.randomUUID() })
    } else {
      updateCustomer(data.id, data)
    }
    handleDrawerClose()
  }

  const handleAddClick = () => {
    setSelectedRow({
      id: '',
      name: '',
      email: '',
      phone: '',
      addressline1: '',
      addressline2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    })
    setIsAddMode(true)
    setDrawerOpen(true)
  }

  const handleEditClick = (row: Customer) => {
    setSelectedRow(row)
    setIsAddMode(false)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    drawerRef.current?.triggerClose()
    setSelectedRow(null)
    setIsAddMode(false)
    setDrawerOpen(false)
  }

  return (
    <>
      <button
        onClick={handleAddClick}
        className="add-button"
        aria-label="Add Customer"
      >
        <IoAddCircleOutline style={{ marginRight: '6px' }} />
        Add Customer
      </button>

      <DataTable
        data={customers}
        columns={CUSTOMER_TABLE_HEADERS as ColumnDef<Customer>[]}
        onRowClick={handleEditClick}
        selectedRowId={selectedRow?.id}
        onDelete={(row) => deleteCustomer(row.id)}
      />

      {drawerOpen && selectedRow && (
        <Drawer
          ref={drawerRef}
          onClose={handleDrawerClose}
          size="lg"
        >
          <CustomerForm
            customer={selectedRow}
            onSave={handleSave}
            isNew={isAddMode}
          />
        </Drawer>
      )}
    </>
  )
}