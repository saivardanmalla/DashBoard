import { create } from 'zustand';

interface UIState {
  isCommandPaletteOpen: boolean;
  isAICopilotOpen: boolean;
  isCommandCenterOpen: boolean;
  setCommandPalette: (open: boolean) => void;
  toggleAICopilot: () => void;
  setCommandCenter: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCommandPaletteOpen: false,
  isAICopilotOpen: false,
  isCommandCenterOpen: false,
  setCommandPalette: (open) => set({ isCommandPaletteOpen: open }),
  toggleAICopilot: () => set((s) => ({ isAICopilotOpen: !s.isAICopilotOpen })),
  setCommandCenter: (open) => set({ isCommandCenterOpen: open }),
}));
