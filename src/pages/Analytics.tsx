import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  Briefcase,
  UserCheck,
  Clock,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobStore } from '@/store/useJobStore';

// Mock data for charts
const mockHiringData = [
  { month: 'Jan', applications: 120, interviews: 45, offers: 12, hired: 8 },
  { month: 'Feb', applications: 150, interviews: 60, offers: 18, hired: 12 },
  { month: 'Mar', applications: 180, interviews: 75, offers: 22, hired: 15 },
  { month: 'Apr', applications: 200, interviews: 85, offers: 25, hired: 18 },
  { month: 'May', applications: 220, interviews: 95, offers: 28, hired: 20 },
  { month: 'Jun', applications: 250, interviews: 110, offers: 32, hired: 24 },
];

const mockSourceData = [
  { source: 'LinkedIn', applications: 45, hired: 8, conversion: 17.8 },
  { source: 'Indeed', applications: 38, hired: 6, conversion: 15.8 },
  { source: 'Company Website', applications: 32, hired: 7, conversion: 21.9 },
  { source: 'Referrals', applications: 28, hired: 9, conversion: 32.1 },
  { source: 'Glassdoor', applications: 25, hired: 4, conversion: 16.0 },
  { source: 'Other', applications: 22, hired: 3, conversion: 13.6 },
];

const mockTimeToHireData = [
  { position: 'Frontend Developer', avgDays: 12, applications: 45 },
  { position: 'Backend Developer', avgDays: 15, applications: 38 },
  { position: 'Full Stack Developer', avgDays: 18, applications: 32 },
  { position: 'Product Manager', avgDays: 22, applications: 28 },
  { position: 'UX Designer', avgDays: 14, applications: 25 },
];

export const Analytics: React.FC = () => {
  const { jobs } = useJobStore();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Calculate metrics from job data
  const metrics = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const totalApplicants = jobs.reduce((acc, job) => acc + job.applicantCount, 0);
    const avgApplicantsPerJob = totalJobs > 0 ? Math.round(totalApplicants / totalJobs) : 0;
    
    return {
      totalJobs,
      activeJobs,
      totalApplicants,
      avgApplicantsPerJob,
      timeToHire: 18, // Mock data
      applicationRate: 64, // Mock data
      interviewSuccess: 78, // Mock data
      offerAcceptance: 85, // Mock data
    };
  }, [jobs]);

  const getConversionColor = (rate: number) => {
    if (rate >= 25) return 'text-green-600';
    if (rate >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track hiring metrics and performance insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time to Hire
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.timeToHire} days</div>
            <p className="text-xs text-success">-2 days from last month</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Application Rate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.applicationRate}%</div>
            <p className="text-xs text-success">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interview Success
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.interviewSuccess}%</div>
            <p className="text-xs text-success">+3% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offer Acceptance
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metrics.offerAcceptance}%</div>
            <p className="text-xs text-success">+1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Hiring Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Funnel Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Applications</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">1,200</div>
                    <div className="text-sm text-muted-foreground">100%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Screening</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">480</div>
                    <div className="text-sm text-muted-foreground">40%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Interviews</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">192</div>
                    <div className="text-sm text-muted-foreground">16%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Offers</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">58</div>
                    <div className="text-sm text-muted-foreground">4.8%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="font-medium">Hired</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">49</div>
                    <div className="text-sm text-muted-foreground">4.1%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHiringData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(data.applications / 250) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {data.applications}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiring Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHiringData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(data.hired / data.applications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {Math.round((data.hired / data.applications) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSourceData.map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{source.source}</h4>
                      <p className="text-sm text-muted-foreground">
                        {source.applications} applications • {source.hired} hired
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getConversionColor(source.conversion)}`}>
                        {source.conversion}%
                      </div>
                      <div className="text-xs text-muted-foreground">conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time to Hire by Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTimeToHireData.map((position) => (
                  <div key={position.position} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{position.position}</h4>
                      <p className="text-sm text-muted-foreground">
                        {position.applications} applications
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {position.avgDays} days
                      </div>
                      <div className="text-xs text-muted-foreground">avg. time</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Timeline Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-muted-foreground">Avg. Days to Screen</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">5</div>
                    <div className="text-sm text-muted-foreground">Avg. Days to Interview</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-muted-foreground">Avg. Days to Offer</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-sm text-muted-foreground">Avg. Days to Accept</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Top Performing Sources</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Referrals</span>
                  <Badge variant="secondary">32.1%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Company Website</span>
                  <Badge variant="secondary">21.9%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">LinkedIn</span>
                  <Badge variant="secondary">17.8%</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Fastest Hiring</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Frontend Developer</span>
                  <Badge variant="secondary">12 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">UX Designer</span>
                  <Badge variant="secondary">14 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backend Developer</span>
                  <Badge variant="secondary">15 days</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Recommendations</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Increase referral program incentives</p>
                <p>• Optimize job descriptions for better conversion</p>
                <p>• Streamline interview process for faster hiring</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};