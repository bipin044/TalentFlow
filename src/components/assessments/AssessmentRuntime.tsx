import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  User,
  Mail,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { Assessment, AssessmentResponse, QuestionResponse } from '@/types/assessment';
import { AssessmentPreview } from './AssessmentPreview';

interface AssessmentRuntimeProps {
  assessmentId: string;
  candidateInfo?: {
    name: string;
    email: string;
  };
  onComplete?: (response: AssessmentResponse) => void;
}

export const AssessmentRuntime: React.FC<AssessmentRuntimeProps> = ({
  assessmentId,
  candidateInfo,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { assessments, saveResponse } = useAssessmentStore();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentResponse, setCurrentResponse] = useState<AssessmentResponse | null>(null);
  const [candidateName, setCandidateName] = useState(candidateInfo?.name || '');
  const [candidateEmail, setCandidateEmail] = useState(candidateInfo?.email || '');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(!candidateInfo);

  // Find assessment
  useEffect(() => {
    const foundAssessment = assessments.find(a => a.id === assessmentId);
    if (foundAssessment) {
      setAssessment(foundAssessment);
      setStartTime(new Date());
    }
  }, [assessmentId, assessments]);

  // Timer effect
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Auto-save responses
  useEffect(() => {
    if (currentResponse && assessment) {
      const autoSaveResponse = {
        ...currentResponse,
        candidateName,
        candidateEmail,
        timeSpent,
      };
      saveResponse(autoSaveResponse);
    }
  }, [currentResponse, candidateName, candidateEmail, timeSpent, assessment, saveResponse]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResponseChange = (response: AssessmentResponse) => {
    setCurrentResponse(response);
  };

  const handleSubmit = async () => {
    if (!assessment || !currentResponse) return;

    setIsSubmitting(true);

    try {
      const finalResponse: AssessmentResponse = {
        ...currentResponse,
        candidateName,
        candidateEmail,
        submittedAt: new Date(),
        isComplete: true,
        timeSpent,
      };

      saveResponse(finalResponse);
      
      if (onComplete) {
        onComplete(finalResponse);
      } else {
        // Navigate to completion page or show success message
        navigate('/dashboard/assessments', { 
          state: { 
            message: 'Assessment submitted successfully!',
            assessmentTitle: assessment.title 
          }
        });
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartAssessment = () => {
    if (!candidateName.trim() || !candidateEmail.trim()) {
      return;
    }
    setShowCandidateForm(false);
  };

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Assessment Not Found</h3>
          <p className="text-muted-foreground">The requested assessment could not be found.</p>
        </div>
      </div>
    );
  }

  if (showCandidateForm) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Candidate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Full Name</Label>
              <Input
                id="candidate-name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidate-email">Email Address</Label>
              <Input
                id="candidate-email"
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleStartAssessment}
                disabled={!candidateName.trim() || !candidateEmail.trim()}
                className="flex-1"
              >
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalQuestions = assessment.sections.reduce((acc, section) => acc + section.questions.length, 0);
  const answeredQuestions = currentResponse?.responses.length || 0;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{assessment.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {candidateName} • {candidateEmail}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeSpent)}</span>
              </div>
              <Badge variant="outline">
                {answeredQuestions}/{totalQuestions} answered
              </Badge>
            </div>
          </div>
          
          <div className="mt-3">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      {currentResponse && (
        <div className="bg-muted/50 border-b">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Save className="w-4 h-4" />
              <span>Responses are automatically saved</span>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Content */}
      <div className="max-w-4xl mx-auto p-6">
        <AssessmentPreview
          assessment={assessment}
          onResponseChange={handleResponseChange}
          initialResponse={currentResponse || undefined}
        />
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-background border-t">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Time spent: {formatTime(timeSpent)}</span>
                <span>Progress: {Math.round(progressPercentage)}%</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              onClick={handleSubmit}
              disabled={!currentResponse || isSubmitting}
              className="px-8"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Assessment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
