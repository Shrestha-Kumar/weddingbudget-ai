import { create } from 'zustand';

export interface BudgetState {
  // Wizard Inputs
  city: string;
  hotelTier: string;
  hotelRooms: number;
  guestCount: number;
  outstationPercentage: number;
  events: string[];
  brideHometown: string;
  groomHometown: string;
  
  // Settings / Updates
  setDetails: (details: Partial<BudgetState>) => void;
  
  // Budget calculations
  costRanges: {
    logistics: { low: number, mid: number, high: number };
    fnb: { low: number, mid: number, high: number };
    artists: { low: number, mid: number, high: number };
    sundries: { low: number, mid: number, high: number };
    decor: { low: number, mid: number, high: number };
  };
  setCostRange: (category: keyof BudgetState['costRanges'], range: { low: number, mid: number, high: number }) => void;
  
  // Chosen images
  selectedDecorImages: Record<string, any[]>;
  addDecorImage: (event: string, image: any) => void;
  removeDecorImage: (event: string, imageId: string) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  city: 'Udaipur',
  hotelTier: '5-star palace',
  hotelRooms: 50,
  guestCount: 200,
  outstationPercentage: 50,
  events: ['Haldi', 'Mehendi', 'Mahila Sangeet', 'Baraat', 'Pheras', 'Reception'],
  brideHometown: 'Mumbai',
  groomHometown: 'Delhi',
  
  setDetails: (details) => set((state) => ({ ...state, ...details })),
  
  costRanges: {
    logistics: { low: 0, mid: 0, high: 0 },
    fnb: { low: 0, mid: 0, high: 0 },
    artists: { low: 0, mid: 0, high: 0 },
    sundries: { low: 0, mid: 0, high: 0 },
    decor: { low: 0, mid: 0, high: 0 },
  },
  
  setCostRange: (category, range) => set((state) => ({
    costRanges: {
      ...state.costRanges,
      [category]: range
    }
  })),
  
  selectedDecorImages: {},
  
  addDecorImage: (event, image) => set((state) => {
    const current = state.selectedDecorImages[event] || [];
    if (current.find(img => img.id === image.id)) return state;
    return {
      selectedDecorImages: {
        ...state.selectedDecorImages,
        [event]: [...current, image]
      }
    };
  }),
  
  removeDecorImage: (event, imageId) => set((state) => {
    const current = state.selectedDecorImages[event] || [];
    return {
      selectedDecorImages: {
        ...state.selectedDecorImages,
        [event]: current.filter(img => img.id !== imageId)
      }
    };
  })
}));
