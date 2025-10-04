import { IoPricetagOutline } from "react-icons/io5";
import { SlGrid } from "react-icons/sl";
import { PiUsers } from "react-icons/pi";
import { IoMapSharp } from "react-icons/io5";
import { TbMoneybag } from "react-icons/tb";
import { PiUserCircleThin } from "react-icons/pi";
import type { ColumnDef } from '@tanstack/react-table'
import { formatPhoneNumber, formatAcres, formatAddress, formatPriceStatus, formatCouponDiscountValue, getCouponExpiration } from './util';
import { useLayoutStore } from './store/useLayoutStore';
import { useCustomerStore } from "./store/useCustomerStore";

export const NAVIGATION_LINKS = [
  { key: 'dashboard', label: 'Dashboard', icon: <SlGrid />, path: '/' },
  { key: 'layouts', label: 'Layouts', icon: <IoMapSharp />, path: '/layouts' },
  { key: 'pricing', label: 'Pricing', icon: <TbMoneybag />, path: '/pricing' },
  { key: 'coupons', label: 'Coupons', icon: <IoPricetagOutline />, path: '/coupons' },
  { key: 'customers', label: 'Customers', icon: <PiUsers />, path: '/customers' },
];

export const PLOTS_TABLE_HEADERS: ColumnDef<any>[] = [
  { accessorKey: 'plotNumber', header: 'Plot Number', size: 50 },
  { accessorKey: 'lpNumber', header: 'LP Number', size: 50 },
  { accessorKey: 'size', header: 'Size', cell: ({ getValue }) => formatAcres(getValue() as number), size: 50, enableSorting: true },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 100,
    cell: ({ getValue }) => {
      const value = String(getValue());

      let className = 'plot-status ';
      switch (value) {
        case 'Available':
          className += 'status-available';
          break;
        case 'Sold':
          className += 'status-sold';
          break;
        case 'Registered':
          className += 'status-registered';
          break;
        default:
          className += 'status-default';
      }

      return (
        <span className={className}>
          {value}
        </span>
      );
    },
    enableSorting: true,
  },
  { accessorKey: 'layout', header: 'Layout', size: 100, cell: ({ getValue }) => {
    const layoutId = getValue() as string;
    const getLayoutById = useLayoutStore((state) => state.getLayoutById);
    const layout = getLayoutById(layoutId);
    return layout?.name ?? 'Unknown Layout';
  }},
  { accessorKey: 'crop', header: 'Crop', size: 100 },
  {
    accessorKey: 'customer',
    header: 'Customer',
    size: 100,
    cell: ({ getValue }) => {
      const layoutId = getValue() as string;
      const getCustomerById = useCustomerStore((state) => state.getCustomerById);
      const customer = getCustomerById(layoutId);
      if (!customer?.name) return null;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PiUserCircleThin size={20} />
          <span>{customer.name}</span>
        </div>
      );
    },
  },
  {
    id: 'delete',
    header: '',
    cell: () => null,
    meta: {
      className: 'fixed-width-delete-column',
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];

export const CUSTOMER_TABLE_HEADERS: ColumnDef<any>[] = [
  { accessorKey: 'name', header: 'Name', size: 100 },
  { accessorKey: 'email', header: 'Email', size: 100 },
  { accessorKey: 'phone', header: 'Phone', size:100, cell: ({ getValue }) => formatPhoneNumber(String(getValue())) },
  { accessorKey: 'address', header: 'Address', size: 100, cell: ({ row }) => formatAddress(row.original.addressline1, row.original.addressline2, row.original.city, row.original.state, row.original.zip, row.original.country) },
  {
    id: 'delete',
    header: '',
    cell: () => null,
    meta: {
      className: 'fixed-width-delete-column',
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];

export const LAYOUTS_TABLE_HEADERS: ColumnDef<any>[] = [
  { accessorKey: 'name', header: 'Name', size: 100 },
  { accessorKey: 'address', header: 'Address', size: 200, cell: ({ row }) => formatAddress(row.original.addressline1, row.original.addressline2, row.original.city, row.original.state, row.original.zip, row.original.country) },
  { accessorKey: 'extent', header: 'Extent', size: 20, cell: ({ getValue }) => formatAcres(getValue() as number), enableSorting: true },
  { accessorKey: 'numberOfPlots', header: 'Total Plots', size: 20, enableSorting: true },
  { accessorKey: 'numberOfSoldPlots', header: 'Sold Plots', size: 20, enableSorting: true },
  { accessorKey: 'numberOfAvailablePlots', header: 'Available Plots', size: 20, enableSorting: true },
  { accessorKey: 'numberOfReservedPlots', header: 'Reserved Plots', size: 20, enableSorting: true },
  {
    id: 'delete',
    header: '',
    cell: () => null,
    meta: {
      className: 'fixed-width-delete-column',
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];

export const PRICING_TABLE_HEADERS: ColumnDef<any>[] = [
  { accessorKey: 'name', header: 'Name', size: 100 },
  {
    accessorKey: 'layout',
    header: 'Layout',
    size: 100,
    cell: ({ getValue }) => {
      const layoutId = getValue() as string;
      const getLayoutById = useLayoutStore((state) => state.getLayoutById);
      const layout = getLayoutById(layoutId);
      return layout?.name ?? 'Unknown Layout';
    },
  },
  { accessorKey: 'minSize', header: 'Min Size (Acres)', size: 50, cell: ({ getValue }) => formatAcres(getValue() as number) },
  { accessorKey: 'maxSize', header: 'Max Size (Acres)', size: 50, cell: ({ getValue }) => formatAcres(getValue() as number) },
  { accessorKey: 'pricePerAcre', header: 'Price per Acre', size: 50, cell: ({ getValue }) => `$${getValue()}`, enableSorting: true },
  { accessorKey: 'crop', header: 'Crop', size: 100 },
  {
    id: 'status',
    header: 'Status',
    size: 100,
    cell: ({ row }) => {
      const { validFrom, validTo } = row.original;
      const status = formatPriceStatus(validFrom, validTo);
      const statusClass = status.toLowerCase();
      return <span className={`status-pill ${statusClass}`}>{status}</span>;
    },
    enableSorting: false,
  },
  {
    id: 'delete',
    header: '',
    cell: () => null,
    meta: {
      className: 'fixed-width-delete-column',
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];

export const COUPON_TABLE_HEADERS: ColumnDef<any>[] = [
  { accessorKey: 'code', header: 'Code', size: 200 },
  { accessorKey: 'description', header: 'Description', size: 300 },
  { id: 'discount', header: 'Discount (%)', size: 50, cell: ({ row }) => formatCouponDiscountValue(row.original.discountType, row.original.discountValue) },
  { id: 'validity', header: 'Validity', size: 50, cell: ({ row }) => {
    const validity = getCouponExpiration(row.original.validFrom, row.original.validTo);
    const validityClass = validity.toLowerCase();
    return <span className={`status-pill ${validityClass}`}>{validity}</span>;
  }, enableSorting: false},
  { id: 'delete', header: '', cell: () => null, meta: { className: 'fixed-width-delete-column' }, enableSorting: false, enableColumnFilter: false },
];



export const DASHBOARD_STATS = {
  plotsSold: 45,
  plotsAvailable: 75,
  plotsRegistered: 30,
  totalCustomers: 120,
}