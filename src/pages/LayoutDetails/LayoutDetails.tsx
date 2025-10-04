import './LayoutDetails.css';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PLOTS_TABLE_HEADERS, PRICING_TABLE_HEADERS } from '../../data';
import { DataTable, DashboardCard, Drawer } from '../../components/export';
import { IoChevronBack, IoAddCircleOutline } from 'react-icons/io5';
import { useLayoutStore } from '../../store/useLayoutStore';
import { usePlotStore } from '../../store/usePlotStore';
import { usePricingStore } from '../../store/usePricingStore';
import type { ColumnDef } from '@tanstack/react-table';
import type { Layout, Price } from '../../types';
import PricingForm from '../../components/forms/pricing/PricingForm';
import type { DrawerRef } from '../../components/Drawer';

export default function LayoutDetails() {
  const { layoutId } = useParams<{ layoutId: string }>();
  const navigate = useNavigate();

  const getLayoutById = useLayoutStore((state) => state.getLayoutById);
  const updateLayout = useLayoutStore((state) => state.updateLayout);
  const getPlotsByLayoutId = usePlotStore((state) => state.getPlotsByLayoutId);

  const allPrices = usePricingStore((state) => state.prices);
  const addPricing = usePricingStore((state) => state.addPrice);
  const deletePricing = usePricingStore((state) => state.deletePrice);
  const updatePricing = usePricingStore((state) => state.updatePrice);

  const layout = getLayoutById(layoutId ?? '');
  const plots = getPlotsByLayoutId(layoutId ?? '');

  const prices = useMemo(
    () => allPrices.filter((p) => p.layout === layoutId),
    [allPrices, layoutId]
  );

  const [editableLayout, setEditableLayout] = useState<Layout | null>(null);
  const [selectedRow, setSelectedRow] = useState<Price | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerRef = useRef<DrawerRef>(null);

  useEffect(() => {
    if (layout) setEditableLayout({ ...layout });
  }, [layout]);

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      drawerRef.current.triggerOpen();
    }
  }, [drawerOpen]);

  const handleLayoutSave = () => {
    if (editableLayout) {
      updateLayout(editableLayout.id, editableLayout);
    }
  };

  const handleAddClick = () => {
    setSelectedRow({
      id: '',
      name: '',
      layout: layoutId ?? '',
      pricePerAcre: 0,
      minSize: 0,
      maxSize: 0,
      crop: '',
      validFrom: '',
      validTo: ''
    });
    setIsAddMode(true);
    setDrawerOpen(true);
  };

  const handleChange = (field: keyof Layout, value: string | number) => {
    if (!editableLayout) return;
    setEditableLayout((prev) => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleEditClick = (row: Price) => {
    setSelectedRow(row);
    setIsAddMode(false);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    drawerRef.current?.triggerClose();
    setSelectedRow(null);
    setIsAddMode(false);
    setDrawerOpen(false);
  };

  const handleSave = (data: Price) => {
    if (isAddMode) {
      addPricing({ ...data, id: crypto.randomUUID() });
    } else {
      updatePricing(data.id, data);
    }
    handleDrawerClose();
  };

  const handleDelete = (id: string) => {
    deletePricing(id);
    handleDrawerClose();
  };

  if (!layout || !editableLayout) {
    return (
      <div className="layout-details-container">
        <p className="no-layout-message">No layout found for the given ID.</p>
      </div>
    );
  }

  return (
    <div className="layout-details-container">
      {/* Header */}
      <div className="layout-details-header">
        <div className="layout-details-header-left">
          <IoChevronBack size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <div>
            <p className="layout-details-title">{editableLayout.name}</p>
            <p className="layout-details-id">{layoutId}</p>
          </div>
        </div>
        <div className="layout-details-header-right">
          <button onClick={handleLayoutSave} className="layout-save-button">
            Save
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="layout-stats">
        <DashboardCard title="Total Plots" value={editableLayout.numberOfPlots ?? 0} />
        <DashboardCard title="Sold Plots" value={editableLayout.numberOfSoldPlots ?? 0} />
        <DashboardCard title="Available Plots" value={editableLayout.numberOfAvailablePlots ?? 0} />
        <DashboardCard title="Registered Plots" value={editableLayout.numberOfReservedPlots ?? 0} />
      </div>

      {/* Form */}
      <div className="layout-details-form-container">
        <div className="layout-details-form-left">
          {([
            { label: 'Layout ID', key: 'id', type: 'text' },
            { label: 'Name', key: 'name', type: 'text' },
            { label: 'Extent (in acres)', key: 'extent', type: 'number' },
            { label: 'Address Line 1', key: 'addressline1', type: 'text' },
            { label: 'Address Line 2', key: 'addressline2', type: 'text' },
            { label: 'City', key: 'city', type: 'text' },
            { label: 'State', key: 'state', type: 'text' },
            { label: 'Zip Code', key: 'zip', type: 'text' },
            { label: 'Country', key: 'country', type: 'text' }
          ] as const).map(({ label, key, type }) => (
            <div className="layout-details-form-group" key={key}>
              <label>{label}:</label>
              <input
                type={type}
                value={editableLayout[key] ?? ''}
                onChange={(e) =>
                  handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)
                }
                disabled={key === 'id'}
              />
            </div>
          ))}
        </div>
        <div className="layout-details-form-right">
          <p>🗺️ Map or layout preview will go here.</p>
        </div>
      </div>

      {/* Plots Table */}
      <div className="plots-table-container">
        <h2 className="plots-table-title">Available Plots in this Layout</h2>
        <div className="plots-table-content">
          <button onClick={() => navigate(`/layouts/${layoutId}/plots/new`)} className="add-plot-button">
            <IoAddCircleOutline size={20} />
            Add Plot
          </button>
          <DataTable
            columns={PLOTS_TABLE_HEADERS as ColumnDef<any>[]}
            data={plots}
            onRowClick={(row) => navigate(`/layouts/${layoutId}/plots/${row.id}`)}
          />
        </div>
      </div>

      {/* Price Table */}
      <div className="price-table-container">
        <h2 className="price-table-title">Available Pricing in this Layout</h2>
        <div className="price-table-content">
          <button onClick={handleAddClick} className="add-price-button">
            <IoAddCircleOutline size={20} />
            Add Price
          </button>
          <DataTable
            data={prices}
            columns={PRICING_TABLE_HEADERS as ColumnDef<Price>[]}
            onRowClick={handleEditClick}
            selectedRowId={selectedRow?.id}
            onDelete={(row) => handleDelete(row.id)}
          />
        </div>
      </div>

      {selectedRow && (
        <Drawer ref={drawerRef} onClose={handleDrawerClose} size="lg">
          <PricingForm
            pricing={selectedRow}
            layouts={[layout]}
            onSave={handleSave}
            isNew={isAddMode}
          />
        </Drawer>
      )}
    </div>
  );
}
