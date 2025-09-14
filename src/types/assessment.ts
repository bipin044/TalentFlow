export interface Assessment {
  id: string;
  title: string;
  description: string;
  jobId?: string;
  sections: AssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  validation?: QuestionValidation;
  conditionalLogic?: ConditionalLogic;
  options?: QuestionOption[];
  // Type-specific properties
  maxLength?: number; // for text questions
  minValue?: number; // for numeric questions
  maxValue?: number; // for numeric questions
  fileTypes?: string[]; // for file upload questions
  maxFileSize?: number; // for file upload questions (in MB)
}

export type QuestionType = 
  | 'single-choice'
  | 'multi-choice'
  | 'short-text'
  | 'long-text'
  | 'numeric-range'
  | 'file-upload';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  order: number;
}

export interface QuestionValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string; // regex pattern
  customMessage?: string;
}

export interface ConditionalLogic {
  showIf: {
    questionId: string;
    operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
    value: string | number;
  }[];
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  responses: QuestionResponse[];
  submittedAt?: Date;
  isComplete: boolean;
  timeSpent?: number; // in seconds
}

export interface QuestionResponse {
  questionId: string;
  value: string | string[] | number | File[];
  textValue?: string; // for text-based responses
  numericValue?: number; // for numeric responses
  fileValues?: File[]; // for file upload responses
  optionValues?: string[]; // for choice-based responses
}

export interface AssessmentBuilderState {
  currentAssessment: Assessment | null;
  selectedSectionId: string | null;
  selectedQuestionId: string | null;
  isPreviewMode: boolean;
  isDirty: boolean;
}
