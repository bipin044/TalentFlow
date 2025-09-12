import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const hireFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyDetails: z.string().min(10, "Company details must be at least 10 characters"),
  companyHistory: z.string().min(10, "Company history must be at least 10 characters"),
  whatCompanyDoes: z.string().min(10, "Description must be at least 10 characters"),
  salaryStructure: z.string().min(10, "Salary structure must be at least 10 characters"),
  facilities: z.string().min(10, "Facilities description must be at least 10 characters"),
  businessPartners: z.string().optional(),
  projects: z.string().min(10, "Projects description must be at least 10 characters"),
});

type HireFormData = z.infer<typeof hireFormSchema>;

interface HireFormProps {
  onBack: () => void;
}

export const HireForm = ({ onBack }: HireFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<HireFormData>({
    resolver: zodResolver(hireFormSchema),
    defaultValues: {
      companyName: "",
      companyDetails: "",
      companyHistory: "",
      whatCompanyDoes: "",
      salaryStructure: "",
      facilities: "",
      businessPartners: "",
      projects: "",
    },
  });

  const onSubmit = async (data: HireFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Hire form data:", data);
      
      toast({
        title: "Success!",
        description: "Your company profile has been submitted successfully.",
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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Company Registration</CardTitle>
            <CardDescription>
              Tell us about your company to start hiring top talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Details *</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief company overview" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="companyHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company History *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your company's journey, founding story, and milestones..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatCompanyDoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What Your Company Does *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your company's products, services, and industry focus..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Structure / Hike Policy *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your compensation philosophy, salary ranges, and promotion policies..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facilities & Benefits Offered *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List your office facilities, health benefits, perks, and employee benefits..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessPartners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Partners (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List your key business partners, clients, or collaborations..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current or Future Projects *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your ongoing and upcoming projects, initiatives, and roadmap..."
                          className="min-h-[100px]"
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