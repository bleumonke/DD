import { create } from 'zustand';
import type { Layout } from '../types';

import { PLOTS_MOCK_DATA } from './usePlotStore'; // Import the plot data

// 🔁 Helper: Get plot stats per layout
const getStatsForLayout = (layoutId: string) => {
  const plots = PLOTS_MOCK_DATA.filter((p) => p.layout === layoutId);
  return {
    numberOfPlots: plots.length,
    numberOfSoldPlots: plots.filter((p) => p.status === 'Sold').length,
    numberOfAvailablePlots: plots.filter((p) => p.status === 'Available').length,
    numberOfRegisteredPlots: plots.filter((p) => p.status === 'Registered').length,
  };
};

// 🧪 Raw layouts
const RAW_LAYOUTS: Layout[] = [
  {
    id: '9e5e91aa-9598-4998-95f9-4607613b148d',
    name: 'Green Acres',
    extent: 50,
    addressline1: '123 Green St',
    addressline2: '',
    city: 'Greenville',
    state: 'CA',
    zip: '12345',
    country: 'USA',
    latitude: 37.1234,
    longitude: -119.1234,
  },
  {
    id: 'ad18cc61-c43b-44d9-9d40-26f249267bbf',
    name: 'Sunny Fields',
    extent: 75,
    addressline1: '456 Sunny Ave',
    addressline2: '',
    city: 'Sunnytown',
    state: 'TX',
    zip: '23456',
    country: 'USA',
    latitude: 31.1234,
    longitude: -97.1234,
  },
  {
    id: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3',
    name: 'River Side',
    extent: 100,
    addressline1: '789 River Rd',
    addressline2: '',
    city: 'Rivertown',
    state: 'NY',
    zip: '34567',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: '4a8f4c01-f24e-42c8-8ca1-b7d619427bb4',
    name: 'Hilltop Gardens',
    extent: 60,
    addressline1: '101 Hilltop Blvd',
    addressline2: '',
    city: 'Hilltown',
    state: 'FL',
    zip: '45678',
    country: 'USA',
    latitude: 27.1234,
    longitude: -81.1234,
  },
  {
    id: '5b9f4c01-f24e-42c8-8ca1-b7d619427bb5',
    name: 'Maple Woods',
    extent: 80,
    addressline1: '202 Maple St',
    addressline2: '',
    city: 'Mapleton',
    state: 'IL',
    zip: '56789',
    country: 'USA',
    latitude: 40.1234,
    longitude: -88.1234,
  },
];

// ✅ Enriched mock data
export const LAYOUTS_MOCK_DATA: readonly Layout[] = RAW_LAYOUTS.map((layout) => {
  const stats = getStatsForLayout(layout.id);
  return {
    ...layout,
    ...stats,
  };
});

type LayoutState = {
  layouts: Layout[];
  getLayoutById: (id: string) => Layout | undefined;
  addLayout: (layout: Layout) => void;
  updateLayout: (id: string, updatedLayout: Partial<Layout>) => void;
  deleteLayout: (id: string) => void;
  resetLayouts: () => void;
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  layouts: [...LAYOUTS_MOCK_DATA],

  getLayoutById: (id) => get().layouts.find((layout) => layout.id === id),

  addLayout: (layout) =>
    set((state) => ({
      layouts: [...state.layouts, layout],
    })),

  updateLayout: (id, updatedLayout) =>
    set((state) => ({
      layouts: state.layouts.map((layout) =>
        layout.id === id ? { ...layout, ...updatedLayout } : layout
      ),
    })),

  deleteLayout: (id) =>
    set((state) => ({
      layouts: state.layouts.filter((layout) => layout.id !== id),
    })),

  resetLayouts: () =>
    set(() => ({
      layouts: [...LAYOUTS_MOCK_DATA],
    })),
}));
