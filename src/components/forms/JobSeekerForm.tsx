import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const jobSeekerFormSchema = z.object({
  resume: z.string().min(1, "Resume is required"),
  class10Marks: z.string().min(1, "Class 10 marks are required"),
  class12Marks: z.string().min(1, "Class 12 marks are required"),
  collegeName: z.string().min(2, "College name must be at least 2 characters"),
  collegeMarks: z.string().min(1, "College marks are required"),
  internshipDetails: z.string().min(10, "Internship details must be at least 10 characters"),
  interests: z.string().min(10, "Interests and hobbies must be at least 10 characters"),
});

type JobSeekerFormData = z.infer<typeof jobSeekerFormSchema>;

interface JobSeekerFormProps {
  onBack: () => void;
}

export const JobSeekerForm = ({ onBack }: JobSeekerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<JobSeekerFormData>({
    resolver: zodResolver(jobSeekerFormSchema),
    defaultValues: {
      resume: "",
      class10Marks: "",
      class12Marks: "",
      collegeName: "",
      collegeMarks: "",
      internshipDetails: "",
      interests: "",
    },
  });

  const onSubmit = async (data: JobSeekerFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Job seeker form data:", data);
      
      toast({
        title: "Success!",
        description: "Your profile has been submitted successfully.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-secondary-foreground" />
            </div>
            <CardTitle className="text-3xl">Job Seeker Profile</CardTitle>
            <CardDescription>
              Create your profile to apply for amazing job opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Resume *</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="Select your resume file or paste URL" 
                            {...field} 
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Browse
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="class10Marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class 10 Marks *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 85% or 8.5 CGPA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="class12Marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class 12 Marks *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 88% or 8.8 CGPA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="collegeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your college/university name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collegeMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Marks *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 7.5 CGPA or 75%" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="internshipDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internship Details *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your internship experiences, companies, duration, and key learnings..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests & Hobbies *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your interests, hobbies, skills, and what you're passionate about..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onBack}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="secondary"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Profile"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};