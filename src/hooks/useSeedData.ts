import { useEffect } from 'react';
import { useJobStore } from '@/store/useJobStore';
import { generateSeedJobs } from '@/utils/seedData';

export const useSeedData = () => {
  const { jobs, addJob } = useJobStore();

  useEffect(() => {
    // Only seed data if no jobs exist
    if (jobs.length === 0) {
      const seedJobs = generateSeedJobs();
      seedJobs.forEach((job) => {
        addJob(job);
      });
    }
  }, [jobs.length, addJob]);
};