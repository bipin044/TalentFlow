import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings } from 'lucide-react';
import { ConditionalLogic, AssessmentQuestion } from '@/types/assessment';

interface ConditionalLogicBuilderProps {
  question: AssessmentQuestion;
  allQuestions: AssessmentQuestion[];
  onUpdate: (conditionalLogic: ConditionalLogic) => void;
  onRemove: () => void;
}

export const ConditionalLogicBuilder: React.FC<ConditionalLogicBuilderProps> = ({
  question,
  allQuestions,
  onUpdate,
  onRemove,
}) => {
  const availableQuestions = allQuestions.filter(q => q.id !== question.id);
  const conditionalLogic = question.conditionalLogic;

  const addCondition = () => {
    const newCondition = {
      questionId: availableQuestions[0]?.id || '',
      operator: 'equals' as const,
      value: '',
    };

    const updatedLogic: ConditionalLogic = {
      showIf: [...(conditionalLogic?.showIf || []), newCondition],
    };

    onUpdate(updatedLogic);
  };

  const updateCondition = (index: number, updates: Partial<typeof conditionalLogic.showIf[0]>) => {
    if (!conditionalLogic) return;

    const updatedConditions = conditionalLogic.showIf.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    );

    onUpdate({ showIf: updatedConditions });
  };

  const removeCondition = (index: number) => {
    if (!conditionalLogic) return;

    const updatedConditions = conditionalLogic.showIf.filter((_, i) => i !== index);
    
    if (updatedConditions.length === 0) {
      onRemove();
    } else {
      onUpdate({ showIf: updatedConditions });
    }
  };

  const getQuestionOptions = (questionId: string) => {
    const targetQuestion = allQuestions.find(q => q.id === questionId);
    if (!targetQuestion) return [];

    if (targetQuestion.type === 'single-choice' || targetQuestion.type === 'multi-choice') {
      return targetQuestion.options || [];
    }

    return [];
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Conditional Logic
            <Badge variant="outline" className="text-xs">
              Show this question only if:
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {conditionalLogic?.showIf.map((condition, index) => (
          <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Question</Label>
                <Select
                  value={condition.questionId}
                  onValueChange={(value) => updateCondition(index, { questionId: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select question" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableQuestions.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value: any) => updateCondition(index, { operator: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not-equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greater-than">Greater Than</SelectItem>
                    <SelectItem value="less-than">Less Than</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Value</Label>
                {(() => {
                  const targetQuestion = allQuestions.find(q => q.id === condition.questionId);
                  const isChoiceQuestion = targetQuestion?.type === 'single-choice' || targetQuestion?.type === 'multi-choice';
                  
                  if (isChoiceQuestion) {
                    return (
                      <Select
                        value={condition.value}
                        onValueChange={(value) => updateCondition(index, { value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          {getQuestionOptions(condition.questionId).map((option) => (
                            <SelectItem key={option.id} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }

                  return (
                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(index, { value: e.target.value })}
                      placeholder="Enter value"
                      className="h-8"
                    />
                  );
                })()}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCondition(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={addCondition}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Condition
        </Button>
      </CardContent>
    </Card>
  );
};

interface ConditionalLogicEvaluatorProps {
  question: AssessmentQuestion;
  responses: Record<string, any>;
  allQuestions: AssessmentQuestion[];
}

export const ConditionalLogicEvaluator: React.FC<ConditionalLogicEvaluatorProps> = ({
  question,
  responses,
  allQuestions,
}) => {
  if (!question.conditionalLogic) {
    return true; // Show question if no conditional logic
  }

  const evaluateCondition = (condition: typeof question.conditionalLogic.showIf[0]): boolean => {
    const responseValue = responses[condition.questionId];
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        if (Array.isArray(responseValue)) {
          return responseValue.includes(conditionValue);
        }
        return responseValue === conditionValue;
      
      case 'not-equals':
        if (Array.isArray(responseValue)) {
          return !responseValue.includes(conditionValue);
        }
        return responseValue !== conditionValue;
      
      case 'contains':
        if (typeof responseValue === 'string') {
          return responseValue.toLowerCase().includes(conditionValue.toLowerCase());
        }
        return false;
      
      case 'greater-than':
        const numValue = Number(responseValue);
        const numCondition = Number(conditionValue);
        return !isNaN(numValue) && !isNaN(numCondition) && numValue > numCondition;
      
      case 'less-than':
        const numValue2 = Number(responseValue);
        const numCondition2 = Number(conditionValue);
        return !isNaN(numValue2) && !isNaN(numCondition2) && numValue2 < numCondition2;
      
      default:
        return true;
    }
  };

  // All conditions must be true (AND logic)
  return question.conditionalLogic.showIf.every(evaluateCondition);
};
