import { create } from 'zustand';
import type { Coupon } from '../types'

export const COUPON_MOCK_DATA: Coupon[] = [
  { id: 'ad18cc61-c43b-44d9-9d40-26f249267bbf', code: 'SAVE10', description: 'Save 10% on your next purchase', discountType: 'Percentage', discountValue: 10, validFrom: '2023-01-01', validTo: '2023-12-31', usageLimit: 100, usedCount: 20 },
  { id: '2c6f4c01-f24e-42c8-8ca1-b7d619427bb2', code: 'FALL20', description: '20% off for fall season', discountType: 'Percentage', discountValue: 20, validFrom: '2023-09-01', validTo: '2023-11-30', usageLimit: 50, usedCount: 10 },
  { id: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3', code: 'WELCOME15', description: '15% off for new customers', discountType: 'Percentage', discountValue: 15, validFrom: '2023-01-01', usageLimit: 100, usedCount: 5 },
  { id: '4a8f4c01-f24e-42c8-8ca1-b7d619427bb4', code: 'SPRING5', description: '5% off for spring season', discountType: 'Percentage', discountValue: 5, validFrom: '2023-03-01', validTo: '2023-05-31', usageLimit: 75, usedCount: 30 },
  { id: '5b9f4c01-f24e-42c8-8ca1-b7d619427bb5', code: 'HOLIDAY25', description: '25% off during holiday season', discountType: 'Percentage', discountValue: 25, validFrom: '2023-12-01', validTo: '2023-12-31', usageLimit: 100, usedCount: 0 },
]

type CouponState = {
  coupons: Coupon[];
  getCouponById: (id: string) => Coupon | undefined;
  getCouponsStats: () => { total: number; unexpired: number; expired: number, mostUsed: string, leastUsed: string };
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updatedCoupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  resetCoupons: () => void;
};

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: [...COUPON_MOCK_DATA],

  getCouponById: (id) => get().coupons.find((c) => c.id === id),

  getCouponsStats: () => {
    const coupons = get().coupons;
    const total = coupons.length;
    const currentDate = new Date();
    const unexpired = coupons.filter(c => !c.validTo || new Date(c.validTo) >= currentDate).length;
    const expired = total - unexpired;

    let mostUsed = '';
    let leastUsed = '';

    if (coupons.length > 0) {
      const sortedByUsage = [...coupons].sort((a, b) => b.usedCount - a.usedCount);
      mostUsed = sortedByUsage[0].code;
      leastUsed = sortedByUsage[sortedByUsage.length - 1].code;
    }

    return { total, unexpired, expired, mostUsed, leastUsed };
  },

  addCoupon: (coupon) =>
    set((state) => ({
      coupons: [...state.coupons, coupon],
    })),

  updateCoupon: (id, updatedCoupon) =>
    set((state) => ({
      coupons: state.coupons.map((c) =>
        c.id === id ? { ...c, ...updatedCoupon } : c
      ),
    })),

  deleteCoupon: (id) =>
    set((state) => ({
      coupons: state.coupons.filter((c) => c.id !== id),
    })),

  resetCoupons: () => set({ coupons: [...COUPON_MOCK_DATA] }),
}));
