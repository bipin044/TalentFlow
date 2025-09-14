import { useEffect } from 'react';
import { useCandidateStore } from '@/store/useCandidateStore';
import { generateSeedCandidates } from '@/utils/candidateSeedData';

export const useCandidateSeedData = () => {
  const { candidates, setCandidates } = useCandidateStore();

  useEffect(() => {
    // Only generate seed data if no candidates exist
    if (candidates.length === 0) {
      const seedCandidates = generateSeedCandidates(1000);
      setCandidates(seedCandidates);
    }
  }, [candidates.length, setCandidates]);

  return { candidates };
};
