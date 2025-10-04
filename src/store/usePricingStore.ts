import { create } from 'zustand';
import type { Price } from '../types';

export const PRICING_MOCK_DATA: Price[] = [
  {
    id: '80948149-3d31-4cce-977f-cbaa4149c7b1',
    name: 'Standard Pricing',
    layout: '9e5e91aa-9598-4998-95f9-4607613b148d',
    pricePerAcre: 5000,
    crop: 'Wheat',
    validFrom: '2023-01-01',
    validTo: '2023-12-31',
    minSize: 1,
    maxSize: 10,
  },
  {
    id: '2c6f4c01-f24e-42c8-8ca1-b7d619427bb2',
    name: 'Premium Pricing',
    layout: 'ad18cc61-c43b-44d9-9d40-26f249267bbf',
    pricePerAcre: 7000,
    crop: 'Corn',
    validFrom: '2023-01-01',
    minSize: 1,
    maxSize: 5,
  },
  {
    id: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3',
    name: 'Economy Pricing',
    layout: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3',
    pricePerAcre: 3000,
    crop: 'Soybeans',
    validFrom: '2023-06-01',
    validTo: '2023-12-31',
    minSize: 1,
    maxSize: 15,
  },
  {
    id: '4a8f4c01-f24e-42c8-8ca1-b7d619427bb4',
    name: 'Holiday Special',
    layout: '4a8f4c01-f24e-42c8-8ca1-b7d619427bb4',
    pricePerAcre: 4500,
    crop: 'Rice',
    validFrom: '2023-11-01',
    validTo: '2023-11-30',
    minSize: 1,
    maxSize: 20,
  },
  {
    id: '5b9f4c01-f24e-42c8-8ca1-b7d619427bb5',
    name: 'Bulk Discount',
    layout: '5b9f4c01-f24e-42c8-8ca1-b7d619427bb5',
    pricePerAcre: 4000,
    crop: 'Barley',
    validFrom: '2023-01-01',
    minSize: 1,
    maxSize: 25,
  },
];

type PricingState = {
  prices: Price[];
  getPriceById: (id: string) => Price | undefined;
  getAllPricesForLayout: (layoutId: string) => Price[];
  getAvailablePricesByLayoutForPlot: (layoutId: string, size: number) => Price[];
  addPrice: (price: Price) => void;
  updatePrice: (id: string, updated: Partial<Price>) => void;
  deletePrice: (id: string) => void;
  resetPrices: () => void;
};

export const usePricingStore = create<PricingState>((set, get) => ({
  prices: [...PRICING_MOCK_DATA],

  getPriceById: (id) => get().prices.find((p) => p.id === id),

  getAllPricesForLayout: (layoutId: string) => {
    return get().prices.filter((p) => p.layout === layoutId);
  },

  getAvailablePricesByLayoutForPlot: (layoutId: string, size: number) => {
    const today = new Date();
    return get().prices.filter((p) => {
      const matchesLayout = p.layout === layoutId;
      const matchesSize = size >= p.minSize && size <= p.maxSize;
      const validFrom = p.validFrom ? new Date(p.validFrom) : undefined;
      const validTo = p.validTo ? new Date(p.validTo) : undefined;
      const isValidNow =
        (!validFrom || validFrom <= today) && (!validTo || validTo >= today);

      return matchesLayout && matchesSize && isValidNow;
    });
  },

  addPrice: (price) =>
    set((state) => ({
      prices: [...state.prices, price],
    })),

  updatePrice: (id, updated) =>
    set((state) => ({
      prices: state.prices.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      ),
    })),

  deletePrice: (id) =>
    set((state) => ({
      prices: state.prices.filter((p) => p.id !== id),
    })),

  resetPrices: () => set({ prices: [...PRICING_MOCK_DATA] }),
}));
