import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Save, 
  Settings, 
  GripVertical, 
  Trash2, 
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { Assessment, AssessmentSection, AssessmentQuestion, QuestionType } from '@/types/assessment';
import { QuestionBuilder, QuestionPreview, QUESTION_TYPES } from './QuestionTypes';
import { AssessmentPreview } from './AssessmentPreview';

interface AssessmentBuilderProps {
  assessment: Assessment;
  onSave?: () => void;
  onPublish?: () => void;
}

export const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({
  assessment,
  onSave,
  onPublish,
}) => {
  const {
    updateAssessment,
    addSection,
    updateSection,
    deleteSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setSelectedSection,
    setSelectedQuestion,
    builderState,
  } = useAssessmentStore();

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const handleAssessmentUpdate = (updates: Partial<Assessment>) => {
    updateAssessment(assessment.id, updates);
  };

  const handleAddSection = () => {
    const newSection: Omit<AssessmentSection, 'id' | 'questions'> = {
      title: `Section ${assessment.sections.length + 1}`,
      description: '',
      order: assessment.sections.length,
    };
    addSection(assessment.id, newSection);
  };

  const handleAddQuestion = (sectionId: string, questionType: QuestionType) => {
    const section = assessment.sections.find(s => s.id === sectionId);
    if (!section) return;

    const questionTypeConfig = QUESTION_TYPES.find(type => type.type === questionType);
    const newQuestion: Omit<AssessmentQuestion, 'id'> = {
      type: questionType,
      title: `New ${questionTypeConfig?.label || questionType} Question`,
      description: '',
      required: false,
      order: section.questions.length,
      options: questionTypeConfig?.defaultOptions?.map((option, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        label: option,
        value: `option_${index + 1}`,
        order: index,
      })),
    };
    addQuestion(assessment.id, sectionId, newQuestion);
  };

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const duplicateSection = (section: AssessmentSection) => {
    const newSection: Omit<AssessmentSection, 'id' | 'questions'> = {
      title: `${section.title} (Copy)`,
      description: section.description,
      order: assessment.sections.length,
    };
    addSection(assessment.id, newSection);
  };

  const duplicateQuestion = (sectionId: string, question: AssessmentQuestion) => {
    const newQuestion: Omit<AssessmentQuestion, 'id'> = {
      ...question,
      title: `${question.title} (Copy)`,
      order: assessment.sections.find(s => s.id === sectionId)?.questions.length || 0,
    };
    addQuestion(assessment.id, sectionId, newQuestion);
  };

  // Ensure at least the first question is selected so editor is visible
  useEffect(() => {
    if (!builderState.selectedQuestionId) {
      const first = assessment.sections.flatMap(s => s.questions)[0];
      if (first) {
        setSelectedQuestion(first.id);
      }
    }
  }, [assessment.sections, builderState.selectedQuestionId, setSelectedQuestion]);

  if (isPreviewMode) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Back to Builder
            </Button>
            <Badge variant="outline">Preview Mode</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={onPublish}>
              Publish Assessment
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <AssessmentPreview assessment={assessment} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Left Sidebar - Assessment Structure */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r bg-muted/20 flex flex-col md:sticky md:top-0 md:h-screen">
        <div className="p-4 border-b">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assessment-title">Assessment Title</Label>
              <Input
                id="assessment-title"
                value={assessment.title}
                onChange={(e) => handleAssessmentUpdate({ title: e.target.value })}
                placeholder="Enter assessment title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessment-description">Description</Label>
              <Textarea
                id="assessment-description"
                value={assessment.description}
                onChange={(e) => handleAssessmentUpdate({ description: e.target.value })}
                placeholder="Enter assessment description..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Sections</h3>
              <Button variant="outline" size="sm" onClick={handleAddSection}>
                <Plus className="w-4 h-4 mr-1" />
                Add Section
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-[40vh] md:max-h-none">
            <div className="p-4 space-y-2">
              {assessment.sections.map((section, sectionIndex) => (
                <Card key={section.id} className="border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSectionExpanded(section.id)}
                          className="p-0 h-auto"
                        >
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(assessment.id, section.id, { title: e.target.value })}
                            className="border-0 p-0 h-auto font-medium"
                            placeholder="Section title..."
                          />
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => duplicateSection(section)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteSection(assessment.id, section.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Textarea
                      value={section.description || ''}
                      onChange={(e) => updateSection(assessment.id, section.id, { description: e.target.value })}
                      placeholder="Section description (optional)..."
                      rows={2}
                      className="border-0 p-0 text-sm text-muted-foreground"
                    />
                  </CardHeader>

                  {expandedSections.has(section.id) && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {section.questions.length} questions
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Question
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {QUESTION_TYPES.map((type) => (
                                <DropdownMenuItem
                                  key={type.type}
                                  onClick={() => handleAddQuestion(section.id, type.type)}
                                >
                                  <type.icon className="w-4 h-4 mr-2" />
                                  {type.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          {section.questions.map((question, questionIndex) => (
                            <button
                              key={question.id}
                              type="button"
                              className={`w-full text-left flex items-center gap-2 p-2 border rounded-md bg-background hover:bg-muted/50 ${builderState.selectedQuestionId === question.id ? 'ring-2 ring-primary' : ''}`}
                              onClick={() => { setSelectedSection(section.id); setSelectedQuestion(question.id); }}
                            >
                              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {question.title || 'Untitled question'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {QUESTION_TYPES.find(t => t.type === question.type)?.label}
                                  {question.required && ' • Required'}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-1">
                                    <Settings className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => duplicateQuestion(section.id, question)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => deleteQuestion(assessment.id, section.id, question.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {assessment.sections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No sections yet</p>
                  <p className="text-xs">Add a section to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {assessment.sections.reduce((acc, section) => acc + section.questions.length, 0)} questions
              </Badge>
              <Badge variant={assessment.isPublished ? "default" : "secondary"}>
                {assessment.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsPreviewMode(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onPublish}>
                Publish Assessment
              </Button>
            </div>
          </div>
        </div>

        {/* Question Builder */}
        <div className="flex-1 overflow-auto p-4">
          {builderState.selectedQuestionId ? (
            <div className="max-w-2xl mx-auto">
              {(() => {
                const selectedQuestion = assessment.sections
                  .flatMap(s => s.questions)
                  .find(q => q.id === builderState.selectedQuestionId);
                
                if (!selectedQuestion) return null;

                const allQuestions = assessment.sections.flatMap(s => s.questions);
                
                return (
                  <QuestionBuilder
                    question={selectedQuestion}
                    allQuestions={allQuestions}
                    onUpdate={(updates) => {
                      const section = assessment.sections.find(s => 
                        s.questions.some(q => q.id === selectedQuestion.id)
                      );
                      if (section) {
                        updateQuestion(assessment.id, section.id, selectedQuestion.id, updates);
                      }
                    }}
                    onDelete={() => {
                      const section = assessment.sections.find(s => 
                        s.questions.some(q => q.id === selectedQuestion.id)
                      );
                      if (section) {
                        deleteQuestion(assessment.id, section.id, selectedQuestion.id);
                        setSelectedQuestion(null);
                      }
                    }}
                  />
                );
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Settings className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Select a Question</h3>
                  <p className="text-muted-foreground">
                    Choose a question from the sidebar to edit its properties
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
