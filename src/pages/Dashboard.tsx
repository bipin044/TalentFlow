import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ClipboardList, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobStore } from '@/store/useJobStore';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { jobs } = useJobStore();
  const { user } = useAuth();
  
  const stats = {
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalApplicants: jobs.reduce((acc, job) => acc + job.applicantCount, 0),
    draftJobs: jobs.filter(j => j.status === 'draft').length,
  };

  const quickActions = [
    {
      title: 'Post New Job',
      description: 'Create and publish a new job posting',
      icon: Plus,
      action: () => navigate('/dashboard/jobs'),
      color: 'bg-primary',
    },
    {
      title: 'Review Candidates',
      description: 'Check pending applications',
      icon: Users,
      action: () => navigate('/dashboard/candidates'),
      color: 'bg-secondary',
    },
    {
      title: 'Create Assessment',
      description: 'Build custom evaluation forms',
      icon: ClipboardList,
      action: () => navigate('/dashboard/assessments'),
      color: 'bg-success',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="gradient-surface rounded-xl p-8 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your hiring pipeline today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeJobs}</div>
            <p className="text-xs text-success">+2 from last week</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applicants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalApplicants}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Reviews
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-warning">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="card-elevated hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    New application received for Senior Developer position
                  </p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Product Manager job posting went live
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 py-3">
                <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Assessment completed by candidate John Smith
                  </p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};