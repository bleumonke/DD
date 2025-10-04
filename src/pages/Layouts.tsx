import { useRef, useState, useEffect } from 'react'
import { LAYOUTS_TABLE_HEADERS } from '../data'
import { DataTable, Drawer } from '../components/export'
import { IoAddCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useLayoutStore } from '../store/useLayoutStore';
import LayoutForm from '../components/forms/layout/LayoutForm';
import { DashboardCard } from '../components/export'

import { MdOutlineSell } from "react-icons/md";
import { SlDirection } from "react-icons/sl";
import { CiCircleCheck } from "react-icons/ci";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";

import type { DrawerRef } from '../components/Drawer'
import type { ColumnDef } from '@tanstack/react-table'
import type { Layout } from '../types'

export default function Layouts() {
  const navigate = useNavigate();
  const drawerRef = useRef<DrawerRef>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

  const layouts = useLayoutStore(state => state.layouts);
  const addLayout = useLayoutStore(state => state.addLayout);
  const deleteLayout = useLayoutStore(state => state.deleteLayout);

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      drawerRef.current.triggerOpen();
    }
  }, [drawerOpen]);

  const handleDrawerClose = () => {
    drawerRef.current?.triggerClose();
    setDrawerOpen(false);
    setIsAddMode(false);
    setSelectedLayout(null);
  };

  const handleAddLayout = () => {
    setSelectedLayout({
      id: '',
      name: '',
      extent: 0,
      addressline1: '',
      addressline2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      numberOfPlots: 0,
      numberOfSoldPlots: 0,
      numberOfAvailablePlots: 0,
      numberOfRegisteredPlots: 0,
    });
    setIsAddMode(true);
    setDrawerOpen(true);
  };

  const handleRowClick = (row: Layout) => {
    navigate(`/layouts/${row.id}`);
  };

  const handleSave = (data: Layout) => {
    if (isAddMode) {
      addLayout({ ...data, id: crypto.randomUUID() });
    }
    handleDrawerClose();
  };

  return (
    <div style={{ padding: '1rem', marginTop: '5%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <DashboardCard
          title="Total Plots"
          value={layouts.reduce((acc, layout) => acc + (layout.numberOfPlots ?? 0), 0)}
          icon={<HiOutlineSquare3Stack3D />}
        />
        <DashboardCard
          title="Sold Plots"
          value={layouts.reduce((acc, layout) => acc + (layout.numberOfSoldPlots ?? 0), 0)}
          icon={<MdOutlineSell />}
        />
        <DashboardCard
          title="Available Plots"
          value={layouts.reduce((acc, layout) => acc + (layout.numberOfAvailablePlots ?? 0), 0)}
          icon={<SlDirection />}
        />
        <DashboardCard
          title="Registered Plots"
          value={layouts.reduce((acc, layout) => acc + (layout.numberOfRegisteredPlots ?? 0), 0)}
          icon={<CiCircleCheck />}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button 
          onClick={handleAddLayout} 
          className="add-button"
          aria-label="Add Layout"
        >
          <IoAddCircleOutline style={{ marginRight: '6px' }} />
          Add Layout
        </button>

        <DataTable
          data={layouts}
          columns={LAYOUTS_TABLE_HEADERS as ColumnDef<Layout>[]}
          onRowClick={handleRowClick}
          selectedRowId={null}
          onDelete={(row) => deleteLayout(row.id)}
        />

        {drawerOpen && selectedLayout && (
          <Drawer
            ref={drawerRef}
            onClose={handleDrawerClose}
            size="lg"
          >
            <LayoutForm
              layout={selectedLayout}
              onSave={handleSave}
            />
          </Drawer>
        )}
      </div>
    </div>
  );
}
