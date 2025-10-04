import './PlotDetails.css';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import Select from 'react-select';

import { useCustomerStore } from '../../store/useCustomerStore';
import { useLayoutStore } from '../../store/useLayoutStore';
import { usePlotStore } from '../../store/usePlotStore';
import { usePricingStore } from '../../store/usePricingStore';

import type { Plot } from '../../types';

export default function PlotDetails() {
  const { layoutId, plotId } = useParams<{ layoutId: string; plotId?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(plotId);

  const statusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Sold', label: 'Sold' },
    { value: 'Registered', label: 'Registered' },
  ];

  const getPlotById = usePlotStore((state) => state.getPlotById);
  const updatePlot = usePlotStore((state) => state.updatePlot);
  const createPlot = usePlotStore((state) => state.addPlot);
  const getLayoutById = useLayoutStore((state) => state.getLayoutById);
  const customers = useCustomerStore((state) => state.customers);
  const getAvailablePrices = usePricingStore((state) => state.getAvailablePricesByLayoutForPlot);

  const layout = getLayoutById(layoutId || '');
  const existingPlot = plotId ? getPlotById(plotId) : null;

  const [plot, setPlot] = useState<Plot>({
    id: plotId || crypto.randomUUID(),
    plotNumber: '',
    size: '',
    lpNumber: '',
    status: 'Available',
    customer: '',
    crop: '',
    layout: layoutId || '',
  });

  const [availableCrops, setAvailableCrops] = useState<{ value: string; label: string }[]>([]);

  // Update available crops when layoutId or plot size changes
  useEffect(() => {
    if (!layoutId || !plot.size) {
      setAvailableCrops([]);
      return;
    }

    const prices = getAvailablePrices(layoutId, Number(plot.size));
    const uniqueCrops = Array.from(new Set(prices.map((p) => p.crop))).filter(Boolean);

    const cropOptions = uniqueCrops.map((crop) => ({
      value: crop,
      label: crop,
    }));

    setAvailableCrops(cropOptions);

    // If current crop is no longer available for new size, clear crop
    if (plot.crop && !uniqueCrops.includes(plot.crop)) {
      setPlot((prev) => ({ ...prev, crop: '' }));
    }
  }, [layoutId, plot.size, getAvailablePrices, plot.crop]);

  // Load existing plot on mount/edit
  useEffect(() => {
    if (existingPlot) {
      setPlot(existingPlot);
    }
  }, [existingPlot]);

  // Handle form input changes
  const handleChange = (field: keyof Plot, value: string) => {
    setPlot((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (isEdit) {
      updatePlot(plot.id, plot);
    } else {
      createPlot(plot);
    }
    navigate(-1);
  };

  // Get available prices for current layout and plot size
  const availablePrices = useMemo(() => {
    if (!layoutId || !plot.size) return [];
    return getAvailablePrices(layoutId, Number(plot.size));
  }, [layoutId, plot.size, getAvailablePrices]);

  // Find price info for selected crop
  const selectedPrice = useMemo(() => {
    if (!plot.crop) return undefined;
    return availablePrices.find((p) => p.crop === plot.crop);
  }, [plot.crop, availablePrices]);

  // Extract pricePerAcre
  const pricePerAcre = selectedPrice?.pricePerAcre;

  // Calculate total price if possible
  const totalPrice =
    pricePerAcre && plot.size ? pricePerAcre * Number(plot.size) : undefined;

  return (
    <div className="plot-details-container">
      <div className="plot-details-header">
        <div className="plot-details-header-left">
          <IoChevronBack size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />

          <div className="plot-breadcrumb">
            <span className="breadcrumb-item" onClick={() => navigate(-1)}>{layout?.name || 'Layout'}</span>
            <span className="breadcrumb-separator">/</span>
            {plot.plotNumber && <span className="breadcrumb-item">{plot.plotNumber}</span>}
          </div>
        </div>

        <button className="plot-save-button" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="plot-details-info-container">
        <div className="plot-details-info-left">
          <div className="plot-details-form">
            {[
              { label: 'Layout ID', key: 'layout' },
              { label: 'Plot ID', key: 'id' },
              { label: 'Plot Number', key: 'plotNumber' },
              { label: 'Size in Acres', key: 'size' },
              { label: 'LP Number', key: 'lpNumber' },
            ].map(({ label, key }) => (
              <div className="plot-details-form-group" key={key}>
                <label>{label}:</label>
                <input
                  type="text"
                  value={plot[key as keyof Plot] ?? ''}
                  onChange={(e) => handleChange(key as keyof Plot, e.target.value)}
                  disabled={key === 'id' || key === 'layout'}
                />
              </div>
            ))}

            <div className="plot-details-form-group">
              <label>Status:</label>
              <Select
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === plot.status)}
                onChange={(option) => handleChange('status', option?.value || 'Available')}
                className="plot-select"
                classNamePrefix="plot-status-select"
              />
            </div>

            <div className="plot-details-form-group">
              <label>Customer:</label>
              <Select
                options={customers.map((cust) => ({ value: cust.id, label: cust.name }))}
                value={customers
                  .map((cust) => ({ value: cust.id, label: cust.name }))
                  .find((opt) => opt.value === plot.customer)}
                onChange={(option) => handleChange('customer', option?.value || '')}
                className="plot-select"
                classNamePrefix="plot-customer-select"
              />
            </div>

            <div className="plot-details-form-group">
              <label>Crop:</label>
              <Select
                options={availableCrops}
                value={availableCrops.find((opt) => opt.value === plot.crop) || null}
                onChange={(option) => handleChange('crop', option?.value || '')}
                className="plot-select"
                classNamePrefix="plot-crop-select"
                isClearable
              />
            </div>
          </div>
        </div>

        <div className="plot-details-info-right">
          <p>🗺️ Map or layout preview will go here.</p>
        </div>
      </div>

      {/* --- Pricing Section --- */}
      <div className="plot-pricing-section">
        <div className="plot-pricing-details-info-container">
          <div className="plot-pricing-left">
            <h3>Crop Pricing Information</h3>
            <div className="plot-details-readonly-group">
              <label>Price Per Acre (INR):</label>
              <input
                type="text"
                value={pricePerAcre !== undefined ? pricePerAcre.toLocaleString('en-IN') : 'N/A'}
                readOnly
              />
            </div>

            <div className="plot-details-readonly-group">
              <label>Price Per Cent (INR):</label>
              <input
                type="text"
                value={pricePerAcre !== undefined ? (pricePerAcre / 100).toLocaleString('en-IN') : 'N/A'}
                readOnly
              />
            </div>

            <div className="plot-details-readonly-group">
              <label>Total Price (INR):</label>
              <input
                type="text"
                value={totalPrice !== undefined ? totalPrice.toLocaleString('en-IN') : 'N/A'}
                readOnly
              />
            </div>
          </div>

          <div className="plot-pricing-right">
            <div className="plot-pricing-graph-placeholder">
              📊 Graph placeholder (e.g., price trends, comparisons, etc.)
            </div>
          </div>
        </div>
      </div>

      {/* --- Pricing Section --- */}
      <div className="plot-pricing-section">
        <div className="plot-pricing-details-info-container">
          <div className="plot-pricing-left">
            <h3>Pricing Breakdown</h3>
            <div className="plot-details-readonly-group">
              <label>Price Per Acre (INR):</label>
              <input
                type="text"
                value={pricePerAcre !== undefined ? pricePerAcre.toLocaleString('en-IN') : 'N/A'}
                readOnly
              />
            </div>

            <div className="plot-details-readonly-group">
              <label>Total Price (INR):</label>
              <input
                type="text"
                value={totalPrice !== undefined ? totalPrice.toLocaleString('en-IN') : 'N/A'}
                readOnly
              />
            </div>
          </div>

          <div className="plot-pricing-right">
            <div className="plot-pricing-graph-placeholder">
              📊 Graph placeholder (e.g., price trends, comparisons, etc.)
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}