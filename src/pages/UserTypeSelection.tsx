import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase } from "lucide-react";
import { HireForm } from "@/components/forms/HireForm";
import { JobSeekerForm } from "@/components/forms/JobSeekerForm";

export const UserTypeSelection = () => {
  const [selectedType, setSelectedType] = useState<'hire' | 'job' | null>(null);

  if (selectedType === 'hire') {
    return <HireForm onBack={() => setSelectedType(null)} />;
  }

  if (selectedType === 'job') {
    return <JobSeekerForm onBack={() => setSelectedType(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to TalentFlow
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your path to get started with our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Hire Talent Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setSelectedType('hire')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Hire Talent</CardTitle>
              <CardDescription className="text-base">
                Post jobs and find the perfect candidates for your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Please fill in the following details to post a job:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Company Name & Details</li>
                  <li>• Company History</li>
                  <li>• What Your Company Does</li>
                  <li>• Salary Structure / Hike Policy</li>
                  <li>• Facilities & Benefits Offered</li>
                  <li>• Business Partners (if any)</li>
                  <li>• Current or Future Projects</li>
                </ul>
              </div>
              <Button className="w-full" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Hire Talent
              </Button>
            </CardContent>
          </Card>

          {/* Want a Job Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setSelectedType('job')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <Briefcase className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Want a Job</CardTitle>
              <CardDescription className="text-base">
                Apply for positions and showcase your skills to employers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Please fill in the following details to apply:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Upload Resume</li>
                  <li>• Class 10 & 12 Marks</li>
                  <li>• College Name & Marks</li>
                  <li>• Internship Details</li>
                  <li>• Interests & Hobbies</li>
                </ul>
              </div>
              <Button className="w-full" variant="secondary" size="lg">
                <Briefcase className="w-4 h-4 mr-2" />
                Want a Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};