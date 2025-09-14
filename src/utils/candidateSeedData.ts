import { Candidate } from '@/store/useCandidateStore';

const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kendall',
  'Logan', 'Parker', 'Peyton', 'Reese', 'Sage', 'Skyler', 'Sydney', 'Tatum',
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Jessica',
  'Robert', 'Ashley', 'William', 'Amanda', 'Richard', 'Jennifer', 'Charles',
  'Lisa', 'Joseph', 'Nancy', 'Thomas', 'Karen', 'Christopher', 'Betty',
  'Daniel', 'Helen', 'Matthew', 'Sandra', 'Anthony', 'Donna', 'Mark', 'Carol',
  'Donald', 'Ruth', 'Steven', 'Sharon', 'Paul', 'Michelle', 'Andrew', 'Laura',
  'Joshua', 'Sarah', 'Kenneth', 'Kimberly', 'Kevin', 'Deborah', 'Brian', 'Dorothy',
  'George', 'Lisa', 'Timothy', 'Nancy', 'Ronald', 'Karen', 'Jason', 'Betty',
  'Edward', 'Helen', 'Jeffrey', 'Sandra', 'Ryan', 'Donna', 'Jacob', 'Carol',
  'Gary', 'Ruth', 'Nicholas', 'Sharon', 'Eric', 'Michelle', 'Jonathan', 'Laura',
  'Stephen', 'Sarah', 'Larry', 'Kimberly', 'Justin', 'Deborah', 'Scott', 'Dorothy',
  'Brandon', 'Lisa', 'Benjamin', 'Nancy', 'Samuel', 'Karen', 'Gregory', 'Betty',
  'Alexander', 'Helen', 'Patrick', 'Sandra', 'Jack', 'Donna', 'Dennis', 'Carol',
  'Jerry', 'Ruth', 'Tyler', 'Sharon', 'Aaron', 'Michelle', 'Jose', 'Laura',
  'Henry', 'Sarah', 'Adam', 'Kimberly', 'Douglas', 'Deborah', 'Nathan', 'Dorothy',
  'Peter', 'Lisa', 'Zachary', 'Nancy', 'Kyle', 'Karen', 'Noah', 'Betty',
  'Alan', 'Helen', 'Ethan', 'Sandra', 'Jeremy', 'Donna', 'Christian', 'Carol',
  'Keith', 'Ruth', 'Roger', 'Sharon', 'Terry', 'Michelle', 'Sean', 'Laura',
  'Gerald', 'Sarah', 'Carl', 'Kimberly', 'Harold', 'Deborah', 'Arthur', 'Dorothy'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner',
  'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
  'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox',
  'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett',
  'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders',
  'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins',
  'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes',
  'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander',
  'Hamilton', 'Graham', 'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole',
  'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina', 'Aguilar',
  'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison', 'Fernandez',
  'McDonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry', 'Chen',
  'Freeman', 'Webb', 'Tucker', 'Guzman', 'Burns', 'Crawford', 'Olson', 'Simpson',
  'Porter', 'Hunter', 'Gordon', 'Mendez', 'Silva', 'Shaw', 'Snyder', 'Mason',
  'Dixon', 'Munoz', 'Hunt', 'Hicks', 'Holmes', 'Palmer', 'Wagner', 'Black',
  'Robertson', 'Boyd', 'Rose', 'Stone', 'Salazar', 'Fox', 'Warren', 'Mills',
  'Meyer', 'Rice', 'Schmidt', 'Garza', 'Daniels', 'Ferguson', 'Nichols', 'Stephens',
  'Soto', 'Weaver', 'Ryan', 'Gardner', 'Payne', 'Grant', 'Dunn', 'Spencer',
  'Larson', 'Luna', 'Fowler', 'Espinoza', 'Gonzales', 'Fields', 'Douglas', 'Sandoval',
  'Barrett', 'Hopkins', 'Keller', 'Gregory', 'Todd', 'Cruz', 'Mills', 'Walsh',
  'Cunningham', 'Porter', 'Hunter', 'Gordon', 'Mendez', 'Silva', 'Shaw', 'Snyder',
  'Mason', 'Dixon', 'Munoz', 'Hunt', 'Hicks', 'Holmes', 'Palmer', 'Wagner',
  'Black', 'Robertson', 'Boyd', 'Rose', 'Stone', 'Salazar', 'Fox', 'Warren'
];

const positions = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Product Manager', 'UX Designer', 'UI Designer', 'Data Scientist', 'Data Analyst',
  'Machine Learning Engineer', 'Mobile Developer', 'QA Engineer', 'Technical Lead',
  'Engineering Manager', 'Software Architect', 'Security Engineer', 'Cloud Engineer',
  'Database Administrator', 'Business Analyst', 'Project Manager', 'Scrum Master',
  'Marketing Manager', 'Content Writer', 'Graphic Designer', 'Sales Representative',
  'Customer Success Manager', 'HR Business Partner', 'Recruiter', 'Financial Analyst',
  'Operations Manager', 'Growth Hacker', 'Brand Manager', 'Social Media Manager',
  'SEO Specialist', 'Digital Marketing Specialist', 'Account Executive', 'Sales Manager',
  'VP of Engineering', 'CTO', 'VP of Product', 'VP of Marketing', 'VP of Sales',
  'CEO', 'COO', 'CFO', 'Head of Design', 'Head of Data', 'Head of Operations'
];

const locations = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
  'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Portland, OR', 'Miami, FL',
  'Atlanta, GA', 'Dallas, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'Detroit, MI',
  'Remote', 'London, UK', 'Berlin, Germany', 'Amsterdam, Netherlands', 'Toronto, Canada',
  'Vancouver, Canada', 'Sydney, Australia', 'Melbourne, Australia', 'Dublin, Ireland',
  'Paris, France', 'Barcelona, Spain', 'Stockholm, Sweden', 'Copenhagen, Denmark',
  'Zurich, Switzerland', 'Singapore', 'Tokyo, Japan', 'Seoul, South Korea',
  'Mumbai, India', 'Bangalore, India', 'Tel Aviv, Israel', 'São Paulo, Brazil',
  'Mexico City, Mexico', 'Buenos Aires, Argentina', 'Lagos, Nigeria', 'Cairo, Egypt'
];

const skills = [
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
  'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart',
  'HTML5', 'CSS3', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap', 'Material-UI',
  'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails', 'ASP.NET',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
  'Git', 'GitHub', 'GitLab', 'Jenkins', 'CircleCI', 'Travis CI', 'GitHub Actions',
  'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Principle', 'Framer',
  'Tableau', 'Power BI', 'Looker', 'Google Analytics', 'Mixpanel', 'Amplitude',
  'Salesforce', 'HubSpot', 'Pipedrive', 'Zendesk', 'Intercom', 'Slack',
  'Jira', 'Confluence', 'Notion', 'Asana', 'Trello', 'Monday.com',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'R', 'SQL', 'NoSQL',
  'REST APIs', 'GraphQL', 'Microservices', 'Serverless', 'Event-driven Architecture',
  'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD',
  'Leadership', 'Team Management', 'Project Management', 'Product Strategy',
  'User Research', 'A/B Testing', 'Growth Hacking', 'Content Marketing',
  'SEO', 'SEM', 'Social Media Marketing', 'Email Marketing', 'Analytics'
];

const educationLevels = [
  'High School Diploma', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
  'PhD', 'Bootcamp Graduate', 'Self-taught', 'Certification Program'
];

const stages: Candidate['stage'][] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

export const generateSeedCandidates = (count: number = 1000): Candidate[] => {
  const candidates: Candidate[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@email.com`;
    const position = positions[Math.floor(Math.random() * positions.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const experience = Math.floor(Math.random() * 15) + 1;
    const education = educationLevels[Math.floor(Math.random() * educationLevels.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    
    // Generate random skills (3-8 skills per candidate)
    const candidateSkills = skills
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 6) + 3);
    
    // Generate applied date (within last 90 days)
    const appliedDate = new Date();
    appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 90));
    
    // Generate last activity (within last 30 days)
    const lastActivity = new Date();
    lastActivity.setDate(lastActivity.getDate() - Math.floor(Math.random() * 30));
    
    // Generate status history
    const statusHistory = [
      {
        id: crypto.randomUUID(),
        fromStage: null as Candidate['stage'] | null,
        toStage: 'applied' as Candidate['stage'],
        timestamp: appliedDate.toISOString(),
        changedBy: 'System',
        note: 'Initial application'
      }
    ];
    
    // Add additional status changes if not in applied stage
    if (stage !== 'applied') {
      const stageIndex = stages.indexOf(stage);
      for (let j = 1; j <= stageIndex; j++) {
        const changeDate = new Date(appliedDate);
        changeDate.setDate(changeDate.getDate() + j * Math.floor(Math.random() * 7) + 1);
        
        statusHistory.push({
          id: crypto.randomUUID(),
          fromStage: stages[j - 1],
          toStage: stages[j],
          timestamp: changeDate.toISOString(),
          changedBy: 'HR Team',
          note: `Moved to ${stages[j]} stage`
        });
      }
    }
    
    const candidate: Candidate = {
      id: `candidate-${i + 1}`,
      name,
      email,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 9000) + 1000)}`,
      location,
      position,
      stage,
      experience,
      education,
      skills: candidateSkills,
      appliedDate: appliedDate.toISOString(),
      lastActivity: lastActivity.toISOString(),
      rating,
      notes: [
        `Initial screening notes for ${name}`,
        `Technical assessment completed`,
        `Reference check in progress`
      ],
      linkedin: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      portfolio: `${firstName.toLowerCase()}${lastName.toLowerCase()}.com`,
      statusHistory
    };
    
    candidates.push(candidate);
  }
  
  return candidates;
};
