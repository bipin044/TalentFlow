import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: number;
  education: string;
  skills: string[];
  avatar?: string;
  appliedDate: string;
  lastActivity: string;
  rating: number;
  notes: string[];
  resume?: string;
  linkedin?: string;
  portfolio?: string;
  statusHistory: StatusChange[];
}

export interface StatusChange {
  id: string;
  fromStage: Candidate['stage'] | null;
  toStage: Candidate['stage'];
  timestamp: string;
  note?: string;
  changedBy: string;
}

export interface CandidateNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  mentions: string[];
}

interface CandidateStore {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addCandidate: (candidate: Omit<Candidate, 'id' | 'statusHistory'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  moveCandidateStage: (id: string, newStage: Candidate['stage'], note?: string) => void;
  addNote: (candidateId: string, note: Omit<CandidateNote, 'id' | 'timestamp'>) => void;
  setCandidates: (candidates: Candidate[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCandidateStore = create<CandidateStore>()(
  persist(
    (set, get) => ({
      candidates: [],
      loading: false,
      error: null,

      addCandidate: (candidateData) => {
        const newCandidate: Candidate = {
          ...candidateData,
          id: crypto.randomUUID(),
          statusHistory: [{
            id: crypto.randomUUID(),
            fromStage: null,
            toStage: candidateData.stage,
            timestamp: new Date().toISOString(),
            changedBy: 'System',
            note: 'Initial application'
          }]
        };
        set((state) => ({ candidates: [newCandidate, ...state.candidates] }));
      },

      updateCandidate: (id, updates) => {
        set((state) => ({
          candidates: state.candidates.map((candidate) =>
            candidate.id === id ? { ...candidate, ...updates, lastActivity: new Date().toISOString() } : candidate
          ),
        }));
      },

      deleteCandidate: (id) => {
        set((state) => ({
          candidates: state.candidates.filter((candidate) => candidate.id !== id),
        }));
      },

      moveCandidateStage: (id, newStage, note) => {
        set((state) => ({
          candidates: state.candidates.map((candidate) => {
            if (candidate.id === id) {
              const statusChange: StatusChange = {
                id: crypto.randomUUID(),
                fromStage: candidate.stage,
                toStage: newStage,
                timestamp: new Date().toISOString(),
                note,
                changedBy: 'Current User' // In a real app, this would be the actual user
              };
              
              return {
                ...candidate,
                stage: newStage,
                lastActivity: new Date().toISOString(),
                statusHistory: [...candidate.statusHistory, statusChange]
              };
            }
            return candidate;
          }),
        }));
      },

      addNote: (candidateId, noteData) => {
        set((state) => ({
          candidates: state.candidates.map((candidate) => {
            if (candidate.id === candidateId) {
              const newNote: CandidateNote = {
                ...noteData,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString()
              };
              
              return {
                ...candidate,
                notes: [...candidate.notes, newNote.content],
                lastActivity: new Date().toISOString()
              };
            }
            return candidate;
          }),
        }));
      },

      setCandidates: (candidates) => set({ candidates }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'talentflow-candidates',
    }
  )
);
