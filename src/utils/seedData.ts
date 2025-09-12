import { Job } from '@/store/useJobStore';

export const generateSeedJobs = (): Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicantCount'>[] => {
  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Remote', 'London, UK', 'Berlin, Germany'];
  const types: Job['type'][] = ['full-time', 'part-time', 'contract', 'intern'];
  const statuses: Job['status'][] = ['active', 'archived', 'draft'];
  
  const jobTitles = [
    'Senior Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist',
    'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Marketing Manager',
    'Sales Representative', 'HR Business Partner', 'Financial Analyst', 'Content Writer',
    'Mobile Developer', 'QA Engineer', 'Technical Lead', 'Brand Manager',
    'Customer Success Manager', 'Business Analyst', 'Security Engineer', 'Growth Hacker',
    'VP of Engineering', 'Design Director', 'Operations Manager', 'Recruiter',
    'Account Executive'
  ];

  const tags = [
    'React', 'TypeScript', 'Python', 'AWS', 'Kubernetes', 'Machine Learning',
    'Figma', 'Analytics', 'B2B', 'SaaS', 'Startup', 'Remote-friendly',
    'Senior-level', 'Entry-level', 'Leadership', 'Strategic', 'Creative',
    'Technical', 'Customer-facing', 'Data-driven'
  ];

  const requirements = [
    '5+ years of experience in software development',
    'Strong proficiency in React and TypeScript',
    'Experience with cloud platforms (AWS, GCP, Azure)',
    'Bachelor\'s degree in Computer Science or related field',
    'Excellent communication and leadership skills',
    'Experience with agile development methodologies',
    'Knowledge of database design and optimization',
    'Familiarity with CI/CD pipelines',
    'Strong problem-solving abilities',
    'Experience mentoring junior developers'
  ];

  const descriptions = [
    'Join our dynamic team and help build the next generation of our platform. You\'ll work on challenging problems and have the opportunity to make a significant impact.',
    'We\'re looking for a passionate individual to drive product strategy and work closely with engineering and design teams to deliver exceptional user experiences.',
    'As part of our growing team, you\'ll contribute to scalable systems that serve millions of users worldwide while maintaining high performance and reliability.',
    'This role offers the opportunity to work with cutting-edge technologies and collaborate with a talented team of professionals in a fast-paced environment.',
    'We\'re seeking someone who thrives in a collaborative environment and is excited about solving complex technical challenges at scale.'
  ];

  return jobTitles.slice(0, 25).map((title, index) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    return {
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      department: departments[Math.floor(Math.random() * departments.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      requirements: requirements.slice(0, Math.floor(Math.random() * 5) + 3),
      tags: tags.slice(0, Math.floor(Math.random() * 4) + 2),
    };
  });
};