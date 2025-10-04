import { useRef, useState, useEffect } from 'react'
import { COUPON_TABLE_HEADERS } from '../data';
import { DataTable, Drawer } from '../components/export';
import CouponForm from '../components/forms/coupon/CouponForm';
import { IoAddCircleOutline } from "react-icons/io5";
import { useCouponStore } from '../store/useCouponStore';

import type { ColumnDef } from '@tanstack/react-table'
import type { DrawerRef } from '../components/Drawer';
import type { Coupon } from '../types';


export default function Coupons() {
  const [selectedRow, setSelectedRow] = useState<Coupon | null>(null)
  const [isAddMode, setIsAddMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const coupons = useCouponStore((state) => state.coupons)
  const addCoupon = useCouponStore((state) => state.addCoupon)
  const deleteCoupon = useCouponStore((state) => state.deleteCoupon)
  const updateCoupon = useCouponStore((state) => state.updateCoupon)

  const drawerRef = useRef<DrawerRef>(null)

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      drawerRef.current.triggerOpen()
    }
  }, [drawerOpen])

  const handleSave = (data: Coupon) => {
    if (isAddMode) {
      addCoupon({ ...data, id: crypto.randomUUID() })
    } else {
      updateCoupon(data.id, data)
    }
    handleDrawerClose()
  }

  const handleAddNew = () => {
    setSelectedRow({
      id: '',
      code: '',
      description: '',
      discountType: 'Percentage',
      discountValue: 0,
      validFrom: '',
      validTo: '',
      usageLimit: 0,
      usedCount: 0,
    })
    setIsAddMode(true)
    setDrawerOpen(true)
  }

  const handleEditClick = (row: Coupon) => {
    setSelectedRow(row)
    setIsAddMode(false)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    drawerRef.current?.triggerClose()
    setSelectedRow(null)
    setDrawerOpen(false)
    setIsAddMode(false)
  }

  return (
    <>
      <button
        onClick={handleAddNew}
        className='add-button'
      >
        <IoAddCircleOutline style={{ marginRight: '6px' }} />
        Coupon
      </button>

      <DataTable
        data={coupons}
        columns={COUPON_TABLE_HEADERS as ColumnDef<Coupon>[]}
        onRowClick={(row) => handleEditClick(row)}
        selectedRowId={selectedRow?.id}
        onDelete={(row) => deleteCoupon(row.id)}
      />

      {selectedRow && (
        <Drawer
          ref={drawerRef}
          onClose={() => handleDrawerClose()}
          size="lg"
        >
          <CouponForm
            coupon={selectedRow}
            onSave={handleSave}
            isNew={isAddMode}
          />
        </Drawer>
      )}
    </>
  )
}