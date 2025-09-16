import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useCandidateStore } from '@/store/useCandidateStore';

const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  position: z.string().min(1, 'Position is required'),
  stage: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'], {
    required_error: 'Stage is required',
  }),
  experience: z.number().min(0, 'Experience must be 0 or greater'),
  education: z.string().min(1, 'Education is required'),
  skills: z.string().min(1, 'Skills are required'),
  notes: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: number;
  education: string;
  skills: string[];
  avatar?: string;
  appliedDate: string;
  lastActivity: string;
  rating: number;
  notes: string[];
  resume?: string;
  linkedin?: string;
  portfolio?: string;
}

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCandidate?: Candidate | null;
  onEditComplete?: () => void;
}

export const AddCandidateDialog: React.FC<AddCandidateDialogProps> = ({
  open,
  onOpenChange,
  editingCandidate,
  onEditComplete,
}) => {
  const { addCandidate, updateCandidate } = useCandidateStore();
  
  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      position: '',
      stage: 'applied',
      experience: 0,
      education: '',
      skills: '',
      notes: '',
      linkedin: '',
      portfolio: '',
    },
  });

  // Update form when editing candidate changes
  useEffect(() => {
    if (editingCandidate) {
      form.reset({
        name: editingCandidate.name,
        email: editingCandidate.email,
        phone: editingCandidate.phone,
        location: editingCandidate.location,
        position: editingCandidate.position,
        stage: editingCandidate.stage,
        experience: editingCandidate.experience,
        education: editingCandidate.education,
        skills: editingCandidate.skills.join(', '),
        notes: editingCandidate.notes.join('\n'),
        linkedin: editingCandidate.linkedin || '',
        portfolio: editingCandidate.portfolio || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        location: '',
        position: '',
        stage: 'applied',
        experience: 0,
        education: '',
        skills: '',
        notes: '',
        linkedin: '',
        portfolio: '',
      });
    }
  }, [editingCandidate, form]);

  const onSubmit = (data: CandidateFormData) => {
    try {
      const candidateData = {
        ...data,
        skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
        notes: data.notes ? data.notes.split('\n').filter(n => n.trim()) : [],
        appliedDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        rating: Math.floor(Math.random() * 5) + 1,
        avatar: undefined,
        resume: undefined,
      };

      if (editingCandidate) {
        updateCandidate(editingCandidate.id, candidateData);
        toast.success('Candidate updated successfully!');
      } else {
        addCandidate(candidateData);
        toast.success('Candidate added successfully!');
      }

      form.reset();
      onOpenChange(false);
      onEditComplete?.();
    } catch (error) {
      toast.error(`Failed to ${editingCandidate ? 'update' : 'add'} candidate. Please try again.`);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
    onEditComplete?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. john@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Applied For *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stage *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="screening">Screening</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="50"
                        step="1"
                        placeholder="e.g. 5" 
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d+$/.test(value)) {
                            field.onChange(value === '' ? 0 : parseInt(value));
                          }
                        }}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, decimal point
                          if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
                              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true) ||
                              // Allow: home, end, left, right
                              (e.keyCode >= 35 && e.keyCode <= 39)) {
                            return;
                          }
                          // Ensure that it is a number and stop the keypress
                          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor's in Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. React, TypeScript, Node.js (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this candidate..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. linkedin.com/in/johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Website</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. johndoe.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-primary text-white"
              >
                {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
