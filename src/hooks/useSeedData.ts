import { useEffect } from 'react';
import { useJobStore } from '@/store/useJobStore';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { generateSeedJobs } from '@/utils/seedData';
import { createSampleAssessments } from '@/utils/assessmentSeedData';

export const useSeedData = () => {
  const { jobs, addJob } = useJobStore();
  const { assessments, createAssessment } = useAssessmentStore();

  useEffect(() => {
    // Only seed data if no jobs exist
    if (jobs.length === 0) {
      const seedJobs = generateSeedJobs();
      seedJobs.forEach((job) => {
        addJob(job);
      });
    }
  }, [jobs.length, addJob]);

  useEffect(() => {
    // Only seed data if no assessments exist
    if (assessments.length === 0) {
      const sampleAssessments = createSampleAssessments();
      sampleAssessments.forEach((assessment) => {
        createAssessment(assessment);
      });
    }
  }, [assessments.length, createAssessment]);
};