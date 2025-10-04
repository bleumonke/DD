import { create } from 'zustand';
import type { Plot } from '../types';

// ✅ Mock data (optional: make it readonly to avoid accidental mutations)
export const PLOTS_MOCK_DATA: readonly Plot[] = [
  {
    id: '123dd0e7-17ca-49be-b460-f5079d80c1dd',
    plotNumber: 'A1',
    size: '2.5',
    lpNumber: 'LP1001',
    status: 'Available',
    crop: 'Wheat',
    customer: undefined,
    layout: '9e5e91aa-9598-4998-95f9-4607613b148d',
  },
  {
    id: 'ad18cc61-c43b-44d9-9d40-26f249267bbf',
    plotNumber: 'A2',
    size: '3.0',
    lpNumber: 'LP1002',
    status: 'Sold',
    crop: 'Corn',
    customer: '9bd4fc01-f24e-42c8-8ca1-b7d619427bb1',
    layout: 'ad18cc61-c43b-44d9-9d40-26f249267bbf',
  },
  {
    id: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3',
    plotNumber: 'B1',
    size: '1.5',
    lpNumber: 'LP2001',
    status: 'Registered',
    crop: 'Soybeans',
    customer: '2c6f4c01-f24e-42c8-8ca1-b7d619427bb2',
    layout: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3',
  },
  {
    id: '4a8f4c01-f24e-42c8-8ca1-b7d619427bb4',
    plotNumber: 'B2',
    size: '4.0',
    lpNumber: 'LP2002',
    status: 'Available',
    crop: 'Rice',
    customer: undefined,
    layout: '4a8f4c01-f24e-42c8-8ca1-b7d619427bb4',
  },
  {
    id: '5b9f4c01-f24e-42c8-8ca1-b7d619427bb5',
    plotNumber: 'C1',
    size: '2.0',
    lpNumber: 'LP3001',
    status: 'Sold',
    crop: 'Barley',
    customer: '3e7f4c01-f24e-42c8-8ca1-b7d619427bb3',
    layout: '5b9f4c01-f24e-42c8-8ca1-b7d619427bb5',
  },
];

type PlotState = {
  plots: Plot[];
  getPlotById: (id: string) => Plot | undefined;
  getPlotsByLayoutId: (layoutId: string) => Plot[];
  addPlot: (plot: Plot) => void;
  updatePlot: (id: string, updatedPlot: Partial<Plot>) => void;
  deletePlot: (id: string) => void;
  resetPlots: () => void;
};

export const usePlotStore = create<PlotState>((set, get) => ({
  plots: [...PLOTS_MOCK_DATA],

  getPlotById: (id) =>
    get().plots.find((plot) => plot.id === id),

  getPlotsByLayoutId: (layoutId) =>
    get().plots.filter((plot) => plot.layout === layoutId),

  addPlot: (plot) =>
    set((state) => ({
      plots: [...state.plots, plot],
    })),

  updatePlot: (id, updatedPlot) =>
    set((state) => ({
      plots: state.plots.map((plot) =>
        plot.id === id ? { ...plot, ...updatedPlot } : plot
      ),
    })),

  deletePlot: (id) =>
    set((state) => ({
      plots: state.plots.filter((plot) => plot.id !== id),
    })),

  resetPlots: () =>
    set(() => ({
      plots: [...PLOTS_MOCK_DATA],
    })),
}));
