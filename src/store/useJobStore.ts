import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'intern';
  status: 'active' | 'archived' | 'draft';
  description: string;
  requirements: string[];
  tags: string[];
  salary?: { min: number; max: number };
  company?: { name?: string };
  contact?: { email?: string; website?: string };
  createdAt: Date;
  updatedAt: Date;
  applicantCount: number;
}

interface JobStore {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addJob: (job: Omit<Job, 'id' | 'updatedAt' | 'applicantCount'> & { createdAt?: Date }) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  reorderJobs: (jobs: Job[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: [],
      loading: false,
      error: null,

      addJob: (jobData) => {
        const newJob: Job = {
          ...jobData,
          id: crypto.randomUUID(),
          createdAt: jobData.createdAt ?? new Date(),
          updatedAt: new Date(),
          applicantCount: 0,
        };
        set((state) => ({ jobs: [newJob, ...state.jobs] }));
      },

      updateJob: (id, updates) => {
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id ? { ...job, ...updates, updatedAt: new Date() } : job
          ),
        }));
      },

      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        }));
      },

      reorderJobs: (reorderedJobs) => {
        set({ jobs: reorderedJobs });
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'talentflow-jobs',
    }
  )
);