import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Assessment, AssessmentResponse, QuestionResponse } from '@/types/assessment';
import { QuestionPreview } from './QuestionTypes';
import { ConditionalLogicEvaluator } from './ConditionalLogic';

interface AssessmentPreviewProps {
  assessment: Assessment;
  onResponseChange?: (response: AssessmentResponse) => void;
  initialResponse?: AssessmentResponse;
  isReadOnly?: boolean;
}

export const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({
  assessment,
  onResponseChange,
  initialResponse,
  isReadOnly = false,
}) => {
  const [responses, setResponses] = useState<Record<string, any>>(
    initialResponse?.responses.reduce((acc, response) => {
      acc[response.questionId] = response.value;
      return acc;
    }, {} as Record<string, any>) || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuestionChange = (questionId: string, value: any) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);

    // Clear error when user starts answering
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }

    // Create response object for parent component
    if (onResponseChange) {
      const responseResponses: QuestionResponse[] = Object.entries(newResponses).map(
        ([qId, val]) => ({
          questionId: qId,
          value: val,
          textValue: typeof val === 'string' ? val : undefined,
          numericValue: typeof val === 'number' ? val : undefined,
          optionValues: Array.isArray(val) ? val : undefined,
          fileValues: Array.isArray(val) && val.length > 0 && val[0] instanceof File ? val : undefined,
        })
      );

      const assessmentResponse: AssessmentResponse = {
        id: initialResponse?.id || `response_${Date.now()}`,
        assessmentId: assessment.id,
        responses: responseResponses,
        isComplete: false,
      };

      onResponseChange(assessmentResponse);
    }
  };

  const validateQuestion = (questionId: string, value: any): string | null => {
    const question = assessment.sections
      .flatMap(s => s.questions)
      .find(q => q.id === questionId);

    if (!question) return null;

    // Required validation
    if (question.required) {
      if (value === undefined || value === null || value === '') {
        return 'This question is required';
      }
      if (Array.isArray(value) && value.length === 0) {
        return 'This question is required';
      }
    }

    // Type-specific validations
    if (question.type === 'short-text' || question.type === 'long-text') {
      const textValue = String(value || '');
      
      if (question.maxLength && textValue.length > question.maxLength) {
        return `Maximum length is ${question.maxLength} characters`;
      }
    }

    if (question.type === 'numeric-range') {
      const numericValue = Number(value);
      
      if (isNaN(numericValue)) {
        return 'Please enter a valid number';
      }
      
      if (question.minValue !== undefined && numericValue < question.minValue) {
        return `Minimum value is ${question.minValue}`;
      }
      
      if (question.maxValue !== undefined && numericValue > question.maxValue) {
        return `Maximum value is ${question.maxValue}`;
      }
    }

    if (question.type === 'file-upload') {
      const files = Array.isArray(value) ? value : [];
      
      if (question.maxFileSize) {
        for (const file of files) {
          if (file.size > question.maxFileSize * 1024 * 1024) {
            return `File size must be less than ${question.maxFileSize}MB`;
          }
        }
      }
    }

    return null;
  };

  const validateAllQuestions = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    assessment.sections.forEach(section => {
      section.questions.forEach(question => {
        const error = validateQuestion(question.id, responses[question.id]);
        if (error) {
          newErrors[question.id] = error;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateAllQuestions()) {
      // Handle successful submission
      console.log('Assessment submitted successfully', responses);
    }
  };

  const isComplete = assessment.sections.every(section =>
    section.questions.every(question =>
      !question.required || (responses[question.id] !== undefined && responses[question.id] !== '')
    )
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Assessment Header */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          {assessment.description && (
            <p className="text-muted-foreground mt-2">{assessment.description}</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline">
            {assessment.sections.reduce((acc, section) => acc + section.questions.length, 0)} questions
          </Badge>
          <Badge variant={isComplete ? "default" : "secondary"}>
            {isComplete ? "Complete" : "Incomplete"}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Assessment Sections */}
      <div className="space-y-8">
        {assessment.sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  Section {sectionIndex + 1}: {section.title}
                </span>
              </CardTitle>
              {section.description && (
                <p className="text-muted-foreground">{section.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {section.questions.map((question, questionIndex) => {
                const allQuestions = assessment.sections.flatMap(s => s.questions);
                const shouldShow = ConditionalLogicEvaluator({ 
                  question, 
                  responses, 
                  allQuestions 
                });

                if (!shouldShow) {
                  return null;
                }

                return (
                  <div key={question.id} className="space-y-3">
                    <QuestionPreview
                      question={question}
                      value={responses[question.id]}
                      onChange={(value) => handleQuestionChange(question.id, value)}
                      error={errors[question.id]}
                    />
                    {questionIndex < section.questions.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      {!isReadOnly && (
        <div className="flex justify-center pt-6">
          <Button 
            size="lg" 
            onClick={handleSubmit}
            disabled={!isComplete}
            className="px-8"
          >
            Submit Assessment
          </Button>
        </div>
      )}
    </div>
  );
};
