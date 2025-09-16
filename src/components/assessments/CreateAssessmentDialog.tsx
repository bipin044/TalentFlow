import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { Assessment } from '@/types/assessment';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobStore } from '@/store/useJobStore';

interface CreateAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssessmentCreated: (assessment: Assessment) => void;
}

export const CreateAssessmentDialog: React.FC<CreateAssessmentDialogProps> = ({
  open,
  onOpenChange,
  onAssessmentCreated,
}) => {
  const { createAssessment } = useAssessmentStore();
  const { jobs } = useJobStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobId, setJobId] = useState<string | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      const newAssessment = {
        title: title.trim(),
        description: description.trim(),
        jobId,
        sections: [],
        isPublished: false,
      };

      createAssessment(newAssessment);
      
      // Get the created assessment from the store
      const createdAssessment = useAssessmentStore.getState().currentAssessment;
      if (createdAssessment) {
        onAssessmentCreated(createdAssessment);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setJobId(undefined);
    } catch (error) {
      console.error('Error creating assessment:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setTitle('');
      setDescription('');
      setJobId(undefined);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
          <DialogDescription>
            Create a new assessment to evaluate candidates. You can add sections and questions after creation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Assessment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assessment title..."
              disabled={isCreating}
            />
          </div>
          <div className="grid gap-2">
            <Label>Attach to Job (Optional)</Label>
            <Select value={jobId} onValueChange={setJobId as any}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job (optional)" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assessment description..."
              rows={3}
              disabled={isCreating}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Assessment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
