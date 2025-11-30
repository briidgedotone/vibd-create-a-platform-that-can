import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DNASequence } from '@/types/dna';

interface DNAState {
  sequences: DNASequence[];
  currentSequence: DNASequence | null;
  addSequence: (sequence: DNASequence) => void;
  removeSequence: (id: string) => void;
  setCurrentSequence: (sequence: DNASequence) => void;
}

export const useDNAStore = create<DNAState>()(
  persist(
    (set) => ({
      sequences: [],
      currentSequence: null,
      addSequence: (sequence) => set((state) => ({
        sequences: [sequence, ...state.sequences],
        currentSequence: sequence,
      })),
      removeSequence: (id) => set((state) => {
        const newSequences = state.sequences.filter((s) => s.id !== id);
        return {
          sequences: newSequences,
          currentSequence: state.currentSequence?.id === id
            ? (newSequences.length > 0 ? newSequences[0] : null)
            : state.currentSequence,
        };
      }),
      setCurrentSequence: (sequence) => set(() => ({
        currentSequence: sequence,
      })),
    }),
    {
      name: 'dna-storage',
      partialize: (state) => ({ 
        sequences: state.sequences.map(seq => ({
          ...seq,
          // Convert Date object to string for storage
          timestamp: seq.timestamp instanceof Date 
            ? seq.timestamp.toISOString() 
            : seq.timestamp
        }))
      }),
      onRehydrateStorage: () => (state) => {
        // Convert ISO string back to Date object after rehydration
        if (state?.sequences) {
          state.sequences = state.sequences.map(seq => ({
            ...seq,
            timestamp: new Date(seq.timestamp)
          }));
          
          if (state.sequences.length > 0) {
            state.currentSequence = state.sequences[0];
          }
        }
      }
    }
  )
);