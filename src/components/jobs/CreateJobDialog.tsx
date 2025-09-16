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
import { useJobStore } from '@/store/useJobStore';
import { Job } from '@/store/useJobStore';
import { toast } from 'sonner';

const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  companyName: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'intern'], {
    required_error: 'Job type is required',
  }),
  salaryRange: z.string().optional(),
  description: z.string().min(1, 'Job description is required'),
  status: z.enum(['active', 'draft', 'archived']),
  createdDate: z.string().optional(),
  requirementsText: z.string().optional(),
  tagsText: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type JobFormData = z.infer<typeof jobSchema>;

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJob?: Job | null;
  onEditComplete?: () => void;
}

export const CreateJobDialog: React.FC<CreateJobDialogProps> = ({
  open,
  onOpenChange,
  editingJob,
  onEditComplete,
}) => {
  const { addJob, updateJob } = useJobStore();
  
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      companyName: '',
      location: '',
      type: 'full-time',
      salaryRange: '',
      description: '',
      status: 'active',
      createdDate: '',
      requirementsText: '',
      tagsText: '',
      email: '',
      website: '',
    },
  });

  // Update form when editing job changes
  useEffect(() => {
    if (editingJob) {
      form.reset({
        title: editingJob.title,
        companyName: editingJob.department,
        location: editingJob.location,
        type: editingJob.type as any,
        salaryRange: editingJob.salary ? `${editingJob.salary.min} - ${editingJob.salary.max}` : '',
        description: editingJob.description,
        status: editingJob.status,
        createdDate: editingJob.createdAt ? new Date(editingJob.createdAt).toISOString().slice(0, 10) : '',
        requirementsText: (editingJob.requirements || []).join('\n'),
        tagsText: (editingJob.tags || []).join(', '),
        email: editingJob.contact?.email || '',
        website: editingJob.contact?.website || '',
      });
    } else {
      form.reset({
        title: '',
        companyName: '',
        location: '',
        type: 'full-time',
        salaryRange: '',
        description: '',
        status: 'active',
        createdDate: '',
        requirementsText: '',
        tagsText: '',
        email: '',
        website: '',
      });
    }
  }, [editingJob, form]);

  const onSubmit = (data: JobFormData) => {
    try {
      // Create slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Parse requirements and tags
      const parsedRequirements = (data.requirementsText || '')
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedTags = (data.tagsText || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Parse created date
      const createdAt = data.createdDate ? new Date(data.createdDate) : undefined;

      if (editingJob) {
        // Update existing job
        updateJob(editingJob.id, {
          ...editingJob,
          title: data.title,
          slug,
          department: data.companyName,
          location: data.location,
          type: data.type,
          status: data.status,
          description: data.description,
          salary: data.salaryRange ? {
            min: parseInt(data.salaryRange.split(' - ')[0].replace(/[^0-9]/g, '')),
            max: parseInt(data.salaryRange.split(' - ')[1]?.replace(/[^0-9]/g, '') || '0'),
          } : undefined,
          requirements: parsedRequirements,
          tags: parsedTags.length ? parsedTags : [data.type, data.location],
          company: { name: data.companyName },
          contact: { email: data.email || undefined, website: data.website || undefined },
          createdAt: createdAt || editingJob.createdAt,
        });
        toast.success('Job updated successfully!');
        onEditComplete?.();
      } else {
        // Create new job
        addJob({
          title: data.title,
          slug,
          department: data.companyName,
          location: data.location,
          type: data.type,
          status: data.status,
          description: data.description,
          requirements: parsedRequirements,
          tags: parsedTags.length ? parsedTags : [data.type, data.location],
          salary: data.salaryRange ? {
            min: parseInt(data.salaryRange.split(' - ')[0].replace(/[^0-9]/g, '')),
            max: parseInt(data.salaryRange.split(' - ')[1]?.replace(/[^0-9]/g, '') || '0'),
          } : undefined,
          company: { name: data.companyName },
          contact: { email: data.email || undefined, website: data.website || undefined },
          createdAt,
        });
        toast.success('Job created successfully!');
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to ${editingJob ? 'update' : 'create'} job. Please try again.`);
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
            {editingJob ? 'Edit Job' : 'Create Job'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. TechCorp Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Internship</SelectItem>
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
                name="salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. $80,000 - $120,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
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
                name="createdDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="Select date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. careers@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. https://company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role, responsibilities, and requirements..."
                      className="min-h-[120px] resize-none"
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
                name="requirementsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements (one per line)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"Requirement 1\nRequirement 2"}
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills & Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="react, typescript, frontend"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
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
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};