import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { idbJsonStorage } from '@/lib/zustandStorage';
import { 
  Assessment, 
  AssessmentSection, 
  AssessmentQuestion, 
  AssessmentResponse,
  AssessmentBuilderState,
  QuestionType 
} from '@/types/assessment';

interface AssessmentStore {
  // Assessment management
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  responses: AssessmentResponse[];
  
  // Builder state
  builderState: AssessmentBuilderState;
  
  // Actions
  createAssessment: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  
  // Section management
  addSection: (assessmentId: string, section: Omit<AssessmentSection, 'id' | 'questions'>) => void;
  updateSection: (assessmentId: string, sectionId: string, updates: Partial<AssessmentSection>) => void;
  deleteSection: (assessmentId: string, sectionId: string) => void;
  reorderSections: (assessmentId: string, sectionIds: string[]) => void;
  
  // Question management
  addQuestion: (assessmentId: string, sectionId: string, question: Omit<AssessmentQuestion, 'id'>) => void;
  updateQuestion: (assessmentId: string, sectionId: string, questionId: string, updates: Partial<AssessmentQuestion>) => void;
  deleteQuestion: (assessmentId: string, sectionId: string, questionId: string) => void;
  reorderQuestions: (assessmentId: string, sectionId: string, questionIds: string[]) => void;
  
  // Builder state management
  setBuilderState: (state: Partial<AssessmentBuilderState>) => void;
  setSelectedSection: (sectionId: string | null) => void;
  setSelectedQuestion: (questionId: string | null) => void;
  togglePreviewMode: () => void;
  
  // Response management
  saveResponse: (response: AssessmentResponse) => void;
  getResponsesForAssessment: (assessmentId: string) => AssessmentResponse[];
  
  // Utility functions
  duplicateAssessment: (id: string) => void;
  publishAssessment: (id: string) => void;
  unpublishAssessment: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      assessments: [],
      currentAssessment: null,
      responses: [],
      builderState: {
        currentAssessment: null,
        selectedSectionId: null,
        selectedQuestionId: null,
        isPreviewMode: false,
        isDirty: false,
      },

      createAssessment: (assessmentData) => {
        const newAssessment: Assessment = {
          ...assessmentData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          assessments: [...state.assessments, newAssessment],
          currentAssessment: newAssessment,
          builderState: {
            ...state.builderState,
            currentAssessment: newAssessment,
            isDirty: true,
          },
        }));
      },

      updateAssessment: (id, updates) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === id
              ? { ...assessment, ...updates, updatedAt: new Date() }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === id
            ? { ...state.currentAssessment, ...updates, updatedAt: new Date() }
            : state.currentAssessment,
          builderState: {
            ...state.builderState,
            isDirty: true,
          },
        }));
      },

      deleteAssessment: (id) => {
        set((state) => ({
          assessments: state.assessments.filter((assessment) => assessment.id !== id),
          currentAssessment: state.currentAssessment?.id === id ? null : state.currentAssessment,
          responses: state.responses.filter((response) => response.assessmentId !== id),
        }));
      },

      setCurrentAssessment: (assessment) => {
        set((state) => ({
          currentAssessment: assessment,
          builderState: {
            ...state.builderState,
            currentAssessment: assessment,
            selectedSectionId: null,
            selectedQuestionId: null,
            isDirty: false,
          },
        }));
      },

      addSection: (assessmentId, sectionData) => {
        const newSection: AssessmentSection = {
          ...sectionData,
          id: generateId(),
          questions: [],
        };

        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === assessmentId
              ? {
                  ...assessment,
                  sections: [...assessment.sections, newSection],
                  updatedAt: new Date(),
                }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === assessmentId
            ? {
                ...state.currentAssessment,
                sections: [...state.currentAssessment.sections, newSection],
                updatedAt: new Date(),
              }
            : state.currentAssessment,
          builderState: {
            ...state.builderState,
            isDirty: true,
          },
        }));
      },

      updateSection: (assessmentId, sectionId, updates) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === assessmentId
              ? {
                  ...assessment,
                  sections: assessment.sections.map((section) =>
                    section.id === sectionId ? { ...section, ...updates } : section
                  ),
                  updatedAt: new Date(),
                }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === assessmentId
            ? {
                ...state.currentAssessment,
                sections: state.currentAssessment.sections.map((section) =>
                  section.id === sectionId ? { ...section, ...updates } : section
                ),
                updatedAt: new Date(),
              }
            : state.currentAssessment,
          builderState: {
            ...state.builderState,
            isDirty: true,
          },
        }));
      },

      deleteSection: (assessmentId, sectionId) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === assessmentId
              ? {
                  ...assessment,
                  sections: assessment.sections.filter((section) => section.id !== sectionId),
                  updatedAt: new Date(),
                }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === assessmentId
            ? {
                ...state.currentAssessment,
                sections: state.currentAssessment.sections.filter((section) => section.id !== sectionId),
                updatedAt: new Date(),
              }
            : state.currentAssessment,
          builderState: {
            ...state.builderState,
            isDirty: true,
          },
        }));
      },

      reorderSections: (assessmentId, sectionIds) => {
        set((state) => {
          const assessment = state.assessments.find((a) => a.id === assessmentId);
          if (!assessment) return state;

          const reorderedSections = sectionIds.map((id, index) => {
            const section = assessment.sections.find((s) => s.id === id);
            return section ? { ...section, order: index } : null;
          }).filter(Boolean) as AssessmentSection[];

          return {
            assessments: state.assessments.map((a) =>
              a.id === assessmentId
                ? { ...a, sections: reorderedSections, updatedAt: new Date() }
                : a
            ),
            currentAssessment: state.currentAssessment?.id === assessmentId
              ? { ...state.currentAssessment, sections: reorderedSections, updatedAt: new Date() }
              : state.currentAssessment,
            builderState: {
              ...state.builderState,
              isDirty: true,
            },
          };
        });
      },

      addQuestion: (assessmentId, sectionId, questionData) => {
        const newQuestion: AssessmentQuestion = {
          ...questionData,
          id: generateId(),
        };

        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === assessmentId
              ? {
                  ...assessment,
                  sections: assessment.sections.map((section) =>
                    section.id === sectionId
                      ? { ...section, questions: [...section.questions, newQuestion] }
                      : section
                  ),
                  updatedAt: new Date(),
                }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === assessmentId
            ? {
                ...state.currentAssessment,
                sections: state.currentAssessment.sections.map((section) =>
                  section.id === sectionId
                    ? { ...section, questions: [...section.questions, newQuestion] }
                    : section
                ),
                updatedAt: new Date(),
              }
            : state.currentAssessment,
          builderState: {
            ...state.builderState,
            isDirty: true,
          },
        }));
      },

      updateQuestion: (assessmentId, sectionId, questionId, updates) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === assessmentId
              ? {
                  ...assessment,
                  sections: assessment.sections.map((section) =>
                    section.id === sectionId
                      ? {
                          ...section,
                          questions: section.questions.map((question) =>
                            question.id === questionId ? { ...question, ...updates } : question
                          ),
                        }
                      : section
                  ),
                  updatedAt: new Date(),
                }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === assessmentId
            ? {
                ...state.currentAssessment,
                sections: state.currentAssessment.sections.map((section) =>
                  section.id === sectionId
                    ? {
                        ...section,
                        questions: section.questions.map((question) =>
                          question.id === questionId ? { ...question, ...updates } : question
                        ),
                      }
                    : section
                ),
                updatedAt: new Date(),
              }
            : state.currentAssessment,
          builderState: {
            ...state.builderState,
            isDirty: true,
          },
        }));
      },

      deleteQuestion: (assessmentId, sectionId, questionId) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === assessmentId
              ? {
                  ...assessment,
                  sections: assessment.sections.map((section) =>
                    section.id === sectionId
                      ? {
                          ...section,
                          questions: section.questions.filter((question) => question.id !== questionId),
                        }
                      : section
                  ),
                  updatedAt: new Date(),
                }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === assessmentId
            ? {
                ...state.currentAssessment,
                sections: state.currentAssessment.sections.map((section) =>
                  section.id === sectionId
                    ? {
                        ...section,
                        questions: section.questions.filter((question) => question.id !== questionId),
                      }
                    : section
                ),
                updatedAt: new Date(),
              }
            : state.currentAssessment,
          builderState: {
            ...state.builderState,
            isDirty: true,
          },
        }));
      },

      reorderQuestions: (assessmentId, sectionId, questionIds) => {
        set((state) => {
          const assessment = state.assessments.find((a) => a.id === assessmentId);
          if (!assessment) return state;

          const section = assessment.sections.find((s) => s.id === sectionId);
          if (!section) return state;

          const reorderedQuestions = questionIds.map((id, index) => {
            const question = section.questions.find((q) => q.id === id);
            return question ? { ...question, order: index } : null;
          }).filter(Boolean) as AssessmentQuestion[];

          return {
            assessments: state.assessments.map((a) =>
              a.id === assessmentId
                ? {
                    ...a,
                    sections: a.sections.map((s) =>
                      s.id === sectionId ? { ...s, questions: reorderedQuestions } : s
                    ),
                    updatedAt: new Date(),
                  }
                : a
            ),
            currentAssessment: state.currentAssessment?.id === assessmentId
              ? {
                  ...state.currentAssessment,
                  sections: state.currentAssessment.sections.map((s) =>
                    s.id === sectionId ? { ...s, questions: reorderedQuestions } : s
                  ),
                  updatedAt: new Date(),
                }
              : state.currentAssessment,
            builderState: {
              ...state.builderState,
              isDirty: true,
            },
          };
        });
      },

      setBuilderState: (newState) => {
        set((state) => ({
          builderState: { ...state.builderState, ...newState },
        }));
      },

      setSelectedSection: (sectionId) => {
        set((state) => ({
          builderState: {
            ...state.builderState,
            selectedSectionId: sectionId,
            selectedQuestionId: null,
          },
        }));
      },

      setSelectedQuestion: (questionId) => {
        set((state) => ({
          builderState: {
            ...state.builderState,
            selectedQuestionId: questionId,
          },
        }));
      },

      togglePreviewMode: () => {
        set((state) => ({
          builderState: {
            ...state.builderState,
            isPreviewMode: !state.builderState.isPreviewMode,
          },
        }));
      },

      saveResponse: (response) => {
        set((state) => ({
          responses: [...state.responses.filter((r) => r.id !== response.id), response],
        }));
      },

      getResponsesForAssessment: (assessmentId) => {
        return get().responses.filter((response) => response.assessmentId === assessmentId);
      },

      duplicateAssessment: (id) => {
        const assessment = get().assessments.find((a) => a.id === id);
        if (!assessment) return;

        const duplicatedAssessment: Assessment = {
          ...assessment,
          id: generateId(),
          title: `${assessment.title} (Copy)`,
          isPublished: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          assessments: [...state.assessments, duplicatedAssessment],
        }));
      },

      publishAssessment: (id) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === id
              ? { ...assessment, isPublished: true, updatedAt: new Date() }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === id
            ? { ...state.currentAssessment, isPublished: true, updatedAt: new Date() }
            : state.currentAssessment,
        }));
      },

      unpublishAssessment: (id) => {
        set((state) => ({
          assessments: state.assessments.map((assessment) =>
            assessment.id === id
              ? { ...assessment, isPublished: false, updatedAt: new Date() }
              : assessment
          ),
          currentAssessment: state.currentAssessment?.id === id
            ? { ...state.currentAssessment, isPublished: false, updatedAt: new Date() }
            : state.currentAssessment,
        }));
      },
    }),
    {
      name: 'assessment-store',
      storage: idbJsonStorage('zustand'),
      partialize: (state) => ({
        assessments: state.assessments,
        responses: state.responses,
        builderState: state.builderState,
      }),
    }
  )
);
