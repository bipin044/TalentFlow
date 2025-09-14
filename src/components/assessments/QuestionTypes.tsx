import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Upload, 
  FileText, 
  Hash, 
  CheckSquare, 
  Circle,
  Type,
  AlignLeft
} from 'lucide-react';
import { AssessmentQuestion, QuestionType } from '@/types/assessment';
import { ConditionalLogicBuilder } from './ConditionalLogic';

interface QuestionTypeConfig {
  type: QuestionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultOptions?: string[];
}

export const QUESTION_TYPES: QuestionTypeConfig[] = [
  {
    type: 'single-choice',
    label: 'Single Choice',
    icon: Circle,
    description: 'Select one option from a list',
    defaultOptions: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    type: 'multi-choice',
    label: 'Multiple Choice',
    icon: CheckSquare,
    description: 'Select multiple options from a list',
    defaultOptions: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    type: 'short-text',
    label: 'Short Text',
    icon: Type,
    description: 'Single line text input',
  },
  {
    type: 'long-text',
    label: 'Long Text',
    icon: AlignLeft,
    description: 'Multi-line text input',
  },
  {
    type: 'numeric-range',
    label: 'Numeric Range',
    icon: Hash,
    description: 'Number input with min/max validation',
  },
  {
    type: 'file-upload',
    label: 'File Upload',
    icon: Upload,
    description: 'Upload files with type and size restrictions',
  },
];

interface QuestionBuilderProps {
  question: AssessmentQuestion;
  onUpdate: (updates: Partial<AssessmentQuestion>) => void;
  onDelete: () => void;
  allQuestions?: AssessmentQuestion[];
}

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  onUpdate,
  onDelete,
  allQuestions = [],
}) => {
  const handleTitleChange = (title: string) => {
    onUpdate({ title });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ description });
  };

  const handleRequiredChange = (required: boolean) => {
    onUpdate({ required });
  };

  const handleMaxLengthChange = (maxLength: number) => {
    onUpdate({ maxLength });
  };

  const handleMinValueChange = (minValue: number) => {
    onUpdate({ minValue });
  };

  const handleMaxValueChange = (maxValue: number) => {
    onUpdate({ maxValue });
  };

  const handleFileTypesChange = (fileTypes: string[]) => {
    onUpdate({ fileTypes });
  };

  const handleMaxFileSizeChange = (maxFileSize: number) => {
    onUpdate({ maxFileSize });
  };

  const addOption = () => {
    const newOption = {
      id: Math.random().toString(36).substr(2, 9),
      label: `Option ${(question.options?.length || 0) + 1}`,
      value: `option_${(question.options?.length || 0) + 1}`,
      order: question.options?.length || 0,
    };
    onUpdate({ options: [...(question.options || []), newOption] });
  };

  const updateOption = (optionId: string, updates: Partial<{ label: string; value: string }>) => {
    const updatedOptions = question.options?.map((option) =>
      option.id === optionId ? { ...option, ...updates } : option
    );
    onUpdate({ options: updatedOptions });
  };

  const deleteOption = (optionId: string) => {
    const updatedOptions = question.options?.filter((option) => option.id !== optionId);
    onUpdate({ options: updatedOptions });
  };

  const questionTypeConfig = QUESTION_TYPES.find((type) => type.type === question.type);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {questionTypeConfig && (
              <questionTypeConfig.icon className="w-4 h-4 text-muted-foreground" />
            )}
            <CardTitle className="text-sm font-medium">
              {questionTypeConfig?.label || question.type}
            </CardTitle>
            {question.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Title */}
        <div className="space-y-2">
          <Label htmlFor={`title-${question.id}`}>Question Title</Label>
          <Input
            id={`title-${question.id}`}
            value={question.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter question title..."
          />
        </div>

        {/* Question Description */}
        <div className="space-y-2">
          <Label htmlFor={`description-${question.id}`}>Description (Optional)</Label>
          <Textarea
            id={`description-${question.id}`}
            value={question.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter question description..."
            rows={2}
          />
        </div>

        {/* Required Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`required-${question.id}`}
            checked={question.required}
            onCheckedChange={handleRequiredChange}
          />
          <Label htmlFor={`required-${question.id}`}>Required question</Label>
        </div>

        {/* Type-specific configurations */}
        {question.type === 'single-choice' || question.type === 'multi-choice' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(option.id, { label: e.target.value })}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOption(option.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : question.type === 'short-text' || question.type === 'long-text' ? (
          <div className="space-y-2">
            <Label htmlFor={`maxLength-${question.id}`}>Maximum Length</Label>
            <Input
              id={`maxLength-${question.id}`}
              type="number"
              value={question.maxLength || ''}
              onChange={(e) => handleMaxLengthChange(parseInt(e.target.value) || 0)}
              placeholder="No limit"
            />
          </div>
        ) : question.type === 'numeric-range' ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`minValue-${question.id}`}>Minimum Value</Label>
              <Input
                id={`minValue-${question.id}`}
                type="number"
                value={question.minValue || ''}
                onChange={(e) => handleMinValueChange(parseInt(e.target.value) || 0)}
                placeholder="No minimum"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`maxValue-${question.id}`}>Maximum Value</Label>
              <Input
                id={`maxValue-${question.id}`}
                type="number"
                value={question.maxValue || ''}
                onChange={(e) => handleMaxValueChange(parseInt(e.target.value) || 0)}
                placeholder="No maximum"
              />
            </div>
          </div>
        ) : question.type === 'file-upload' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`fileTypes-${question.id}`}>Allowed File Types</Label>
              <Input
                id={`fileTypes-${question.id}`}
                value={question.fileTypes?.join(', ') || ''}
                onChange={(e) => handleFileTypesChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                placeholder="pdf, doc, docx, jpg, png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`maxFileSize-${question.id}`}>Maximum File Size (MB)</Label>
              <Input
                id={`maxFileSize-${question.id}`}
                type="number"
                value={question.maxFileSize || ''}
                onChange={(e) => handleMaxFileSizeChange(parseInt(e.target.value) || 0)}
                placeholder="10"
              />
            </div>
          </div>
        ) : null}

        {/* Conditional Logic */}
        {question.conditionalLogic && (
          <div className="mt-4">
            <ConditionalLogicBuilder
              question={question}
              allQuestions={allQuestions}
              onUpdate={(conditionalLogic) => onUpdate({ conditionalLogic })}
              onRemove={() => onUpdate({ conditionalLogic: undefined })}
            />
          </div>
        )}

        {/* Add Conditional Logic Button */}
        {!question.conditionalLogic && allQuestions.length > 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate({ 
                conditionalLogic: { 
                  showIf: [{ 
                    questionId: allQuestions[0].id, 
                    operator: 'equals', 
                    value: '' 
                  }] 
                } 
              })}
            >
              <Settings className="w-4 h-4 mr-2" />
              Add Conditional Logic
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface QuestionPreviewProps {
  question: AssessmentQuestion;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const handleSingleChoiceChange = (selectedValue: string) => {
    onChange?.(selectedValue);
  };

  const handleMultiChoiceChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange?.([...currentValues, optionValue]);
    } else {
      onChange?.(currentValues.filter((v) => v !== optionValue));
    }
  };

  const handleTextChange = (text: string) => {
    onChange?.(text);
  };

  const handleNumericChange = (num: number) => {
    onChange?.(num);
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      onChange?.(Array.from(files));
    }
  };

  const questionTypeConfig = QUESTION_TYPES.find((type) => type.type === question.type);

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        {questionTypeConfig && (
          <questionTypeConfig.icon className="w-4 h-4 text-muted-foreground mt-1" />
        )}
        <div className="flex-1">
          <Label className="text-sm font-medium">
            {question.title}
            {question.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {question.description && (
            <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
          )}
        </div>
      </div>

      <div className="ml-6">
        {question.type === 'single-choice' && (
          <RadioGroup
            value={value || ''}
            onValueChange={handleSingleChoiceChange}
            className="space-y-2"
          >
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.id}`} />
                <Label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'multi-choice' && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.id}`}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => handleMultiChoiceChange(option.value, !!checked)}
                />
                <Label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'short-text' && (
          <Input
            value={value || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your answer..."
            maxLength={question.maxLength}
          />
        )}

        {question.type === 'long-text' && (
          <Textarea
            value={value || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your answer..."
            rows={4}
            maxLength={question.maxLength}
          />
        )}

        {question.type === 'numeric-range' && (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleNumericChange(parseInt(e.target.value) || 0)}
            placeholder="Enter a number..."
            min={question.minValue}
            max={question.maxValue}
          />
        )}

        {question.type === 'file-upload' && (
          <div className="space-y-2">
            <Input
              type="file"
              multiple
              accept={question.fileTypes?.map(type => `.${type}`).join(',')}
              onChange={(e) => handleFileChange(e.target.files)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            {question.fileTypes && question.fileTypes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Allowed types: {question.fileTypes.join(', ')}
              </p>
            )}
            {question.maxFileSize && (
              <p className="text-xs text-muted-foreground">
                Maximum file size: {question.maxFileSize}MB
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
};
