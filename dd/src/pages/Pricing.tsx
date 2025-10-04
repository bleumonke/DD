import { useRef, useState, useEffect } from 'react'
import { PRICING_TABLE_HEADERS } from '../data'
import { DataTable, Drawer } from '../components/export'
import PricingForm from '../components/forms/pricing/PricingForm'
import { IoAddCircleOutline } from "react-icons/io5";
import { usePricingStore } from '../store/usePricingStore';
import { useLayoutStore } from '../store/useLayoutStore';

import type { DrawerRef } from '../components/Drawer'
import type { ColumnDef } from '@tanstack/react-table'
import type { Price } from '../types'

export default function Pricing() {
  const [selectedRow, setSelectedRow] = useState<Price | null>(null)
  const [isAddMode, setIsAddMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const prices = usePricingStore((state) => state.prices)
  const addPricing = usePricingStore((state) => state.addPrice)
  const deletePricing = usePricingStore((state) => state.deletePrice)
  const updatePricing = usePricingStore((state) => state.updatePrice)

  const layouts = useLayoutStore((state) => state.layouts)

  const drawerRef = useRef<DrawerRef>(null)

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      drawerRef.current.triggerOpen()
    }
  }, [drawerOpen])

  const handleSave = (data: Price) => {
    if (isAddMode) {
      addPricing({ ...data, id: crypto.randomUUID() })
    } else {
      updatePricing(data.id, data)
    }
    handleDrawerClose() 
  }

  const handleAddClick = () => {
    setSelectedRow({
      id: '',
      name: '',
      layout: '',
      pricePerAcre: 0,
      minSize: 0,
      maxSize: 0,
      crop: '',
      validFrom: '',
      validTo: ''
    })
    setIsAddMode(true)
    setDrawerOpen(true)
  }

  const handleEditClick = (row: Price) => {
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
        aria-label="Add Price"
      >
        <IoAddCircleOutline style={{ marginRight: '6px' }} />
        Add Price
      </button>

      <DataTable
        data={prices}
        columns={PRICING_TABLE_HEADERS as ColumnDef<Price>[]}
        onRowClick={handleEditClick}
        selectedRowId={selectedRow?.id}
        onDelete={(row) => deletePricing(row.id)}
      />

      {selectedRow && (
        <Drawer
          ref={drawerRef}
          onClose={handleDrawerClose}
          size="lg"
        >
          <PricingForm
            pricing={selectedRow}
            layouts={layouts}
            onSave={handleSave}
            isNew={isAddMode}
          />
        </Drawer>
      )}
    </>
  )
}