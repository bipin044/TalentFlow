import { Assessment, AssessmentSection, AssessmentQuestion } from '@/types/assessment';

export const sampleAssessments: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Frontend Developer Assessment",
    description: "Comprehensive assessment for frontend developer candidates covering HTML, CSS, JavaScript, and React.",
    sections: [
      {
        id: "section_1",
        title: "Technical Skills",
        description: "Evaluate technical knowledge and problem-solving abilities",
        order: 0,
        questions: [
          {
            id: "q1",
            type: "single-choice",
            title: "What is the primary purpose of React hooks?",
            description: "Choose the most accurate answer about React hooks.",
            required: true,
            order: 0,
            options: [
              { id: "opt1", label: "To manage component state and side effects", value: "state_side_effects", order: 0 },
              { id: "opt2", label: "To replace class components entirely", value: "replace_class", order: 1 },
              { id: "opt3", label: "To improve performance only", value: "performance", order: 2 },
              { id: "opt4", label: "To handle routing in React applications", value: "routing", order: 3 },
            ],
          },
          {
            id: "q2",
            type: "multi-choice",
            title: "Which of the following are valid CSS positioning values?",
            description: "Select all correct CSS positioning properties.",
            required: true,
            order: 1,
            options: [
              { id: "opt5", label: "static", value: "static", order: 0 },
              { id: "opt6", label: "relative", value: "relative", order: 1 },
              { id: "opt7", label: "absolute", value: "absolute", order: 2 },
              { id: "opt8", label: "floating", value: "floating", order: 3 },
              { id: "opt9", label: "fixed", value: "fixed", order: 4 },
            ],
          },
          {
            id: "q3",
            type: "short-text",
            title: "What does the acronym API stand for?",
            description: "Provide the full form of API.",
            required: true,
            order: 2,
            maxLength: 50,
          },
          {
            id: "q4",
            type: "long-text",
            title: "Explain the concept of closures in JavaScript with an example.",
            description: "Provide a detailed explanation with a code example.",
            required: true,
            order: 3,
            maxLength: 500,
          },
          {
            id: "q5",
            type: "numeric-range",
            title: "How many years of experience do you have with React?",
            description: "Enter your years of experience as a number.",
            required: true,
            order: 4,
            minValue: 0,
            maxValue: 20,
          },
        ],
      },
      {
        id: "section_2",
        title: "Problem Solving",
        description: "Assess analytical thinking and problem-solving approach",
        order: 1,
        questions: [
          {
            id: "q6",
            type: "long-text",
            title: "Describe how you would optimize a slow-loading React application.",
            description: "Provide a comprehensive approach to performance optimization.",
            required: true,
            order: 0,
            maxLength: 1000,
          },
          {
            id: "q7",
            type: "file-upload",
            title: "Upload a sample of your code (optional)",
            description: "Share a code sample that demonstrates your programming skills.",
            required: false,
            order: 1,
            fileTypes: ["js", "jsx", "ts", "tsx", "html", "css"],
            maxFileSize: 5,
          },
        ],
      },
    ],
    isPublished: true,
  },
  {
    title: "UX Designer Assessment",
    description: "Assessment to evaluate UX design skills, user research abilities, and design thinking process.",
    sections: [
      {
        id: "section_3",
        title: "Design Fundamentals",
        description: "Test understanding of design principles and user experience concepts",
        order: 0,
        questions: [
          {
            id: "q8",
            type: "single-choice",
            title: "What is the primary goal of user experience design?",
            description: "Choose the most comprehensive answer.",
            required: true,
            order: 0,
            options: [
              { id: "opt10", label: "To make products look beautiful", value: "beautiful", order: 0 },
              { id: "opt11", label: "To create intuitive and user-centered experiences", value: "user_centered", order: 1 },
              { id: "opt12", label: "To follow the latest design trends", value: "trends", order: 2 },
              { id: "opt13", label: "To reduce development costs", value: "costs", order: 3 },
            ],
          },
          {
            id: "q9",
            type: "multi-choice",
            title: "Which methods are commonly used in user research?",
            description: "Select all valid user research methods.",
            required: true,
            order: 1,
            options: [
              { id: "opt14", label: "User interviews", value: "interviews", order: 0 },
              { id: "opt15", label: "Usability testing", value: "usability", order: 1 },
              { id: "opt16", label: "Surveys", value: "surveys", order: 2 },
              { id: "opt17", label: "A/B testing", value: "ab_testing", order: 3 },
              { id: "opt18", label: "Code review", value: "code_review", order: 4 },
            ],
          },
          {
            id: "q10",
            type: "long-text",
            title: "Describe your design process from research to final implementation.",
            description: "Walk through your typical design workflow and methodology.",
            required: true,
            order: 2,
            maxLength: 800,
          },
        ],
      },
    ],
    isPublished: false,
  },
  {
    title: "Product Manager Assessment",
    description: "Evaluate product management skills, strategic thinking, and stakeholder management abilities.",
    sections: [
      {
        id: "section_4",
        title: "Product Strategy",
        description: "Test strategic thinking and product vision",
        order: 0,
        questions: [
          {
            id: "q11",
            type: "single-choice",
            title: "What is the primary responsibility of a Product Manager?",
            description: "Choose the most accurate description.",
            required: true,
            order: 0,
            options: [
              { id: "opt19", label: "To write code and develop features", value: "code", order: 0 },
              { id: "opt20", label: "To define product vision and strategy", value: "strategy", order: 1 },
              { id: "opt21", label: "To manage the development team", value: "team_management", order: 2 },
              { id: "opt22", label: "To handle customer support", value: "support", order: 3 },
            ],
          },
          {
            id: "q12",
            type: "numeric-range",
            title: "How many years of product management experience do you have?",
            description: "Enter your years of experience.",
            required: true,
            order: 1,
            minValue: 0,
            maxValue: 15,
          },
          {
            id: "q13",
            type: "long-text",
            title: "Describe a challenging product decision you had to make and how you handled it.",
            description: "Provide a detailed example of your decision-making process.",
            required: true,
            order: 2,
            maxLength: 1000,
          },
        ],
      },
    ],
    isPublished: true,
  },
];

export const createSampleAssessments = () => {
  return sampleAssessments.map(assessment => ({
    ...assessment,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
    updatedAt: new Date(),
  }));
};
