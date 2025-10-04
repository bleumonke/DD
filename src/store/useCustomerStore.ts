import { create } from 'zustand';
import type { Customer } from '../types';

export const CUSTOMER_MOCK_DATA: Customer[] = [
  { id: '9bd4fc01-f24e-42c8-8ca1-b7d619427bb1', name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890', addressline1: '123 Main St', addressline2: '', city: 'Anytown', state: 'CA', zip: '12345', country: 'USA' },
  { id: '2c6f4c01-f24e-42c8-8ca1-b7d619427bb2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '2345678901', addressline1: '456 Oak St', addressline2: '', city: 'Othertown', state: 'TX', zip: '23456', country: 'USA' },
  { id: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3', name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '3456789012', addressline1: '789 Pine St', addressline2: '', city: 'Sometown', state: 'NY', zip: '34567', country: 'USA' },
  { id: '4a8f4c01-f24e-42c8-8ca1-b7d619427bb4', name: 'Bob Brown', email: 'bob.brown@example.com', phone: '4567890123', addressline1: '101 Maple Ave', addressline2: '', city: 'Smalltown', state: 'FL', zip: '45678', country: 'USA' },
  { id: '5b9f4c01-f24e-42c8-8ca1-b7d619427bb5', name: 'Carol White', email: 'carol.white@example.com', phone: '5678901234', addressline1: '202 Elm St', addressline2: '', city: 'Bigcity', state: 'IL', zip: '56789', country: 'USA' }
];

type CustomerState = {
  customers: Customer[];
  getCustomerById: (id: string) => Customer | undefined;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  resetCustomers: () => void;
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: structuredClone(CUSTOMER_MOCK_DATA),

  getCustomerById: (id) =>
    get().customers.find((c) => c.id === id),

  addCustomer: (customer) =>
    set((state) => {
      if (state.customers.find((c) => c.id === customer.id)) {
        console.warn(`Customer with ID ${customer.id} already exists.`);
        return state;
      }
      return { customers: [...state.customers, customer] };
    }),

  updateCustomer: (id, updatedCustomer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updatedCustomer } : c
      ),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  resetCustomers: () =>
    set({ customers: structuredClone(CUSTOMER_MOCK_DATA) }),
}));
