import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Star,
  ExternalLink,
  FileText,
  MessageSquare,
  Edit,
  Download,
  Eye,
  Clock,
  User,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCandidateStore, Candidate, StatusChange } from '@/store/useCandidateStore';
import { NotesWithMentions } from './NotesWithMentions';
import { AddCandidateDialog } from './AddCandidateDialog';
import { useCandidateSeedData } from '@/hooks/useCandidateSeedData';

export const CandidateProfile: React.FC = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { candidates, moveCandidateStage, addNote } = useCandidateStore();
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Initialize seed data to ensure candidates are loaded
  const { candidates: seedCandidates } = useCandidateSeedData();
  
  // Ensure seed data is loaded when component mounts
  useEffect(() => {
    // The useCandidateSeedData hook will automatically populate the store
  }, []);
  
  const candidate = candidates.find(c => c.id === candidateId);

  // Show loading state while candidates are being loaded
  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Loading candidate...</h3>
        <p className="text-muted-foreground mb-4">Please wait while we load the candidate information.</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">Candidate not found</h3>
        <p className="text-muted-foreground mb-4">The candidate you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/dashboard/candidates')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  const getStageColor = (stage: Candidate['stage']) => {
    switch (stage) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(candidate.id, {
        content: newNote,
        author: 'Current User',
        mentions: extractMentions(newNote)
      });
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const TimelineItem: React.FC<{ change: StatusChange; isLast: boolean }> = ({ change, isLast }) => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
        {!isLast && <div className="w-px h-12 bg-border mt-2" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {change.fromStage ? `Moved from ${change.fromStage} to ${change.toStage}` : `Applied for position`}
          </span>
          <Badge className={getStageColor(change.toStage)} variant="secondary">
            {change.toStage}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {formatDate(change.timestamp)}
            <User className="w-3 h-3 ml-2" />
            {change.changedBy}
          </div>
        </div>
        {change.note && (
          <p className="text-sm text-foreground bg-muted/50 p-2 rounded">{change.note}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/dashboard/candidates')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="w-16 h-16">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {candidate.position}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {candidate.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {candidate.experience} years experience
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStageColor(candidate.stage)}>
                {candidate.stage}
              </Badge>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < candidate.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
            <Button className="gradient-primary text-white">
              Move to Next Stage
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {candidate.statusHistory
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((change, index) => (
                          <TimelineItem 
                            key={change.id} 
                            change={change} 
                            isLast={index === candidate.statusHistory.length - 1}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <p className="text-foreground">{candidate.education}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-foreground">Senior Frontend Developer</h4>
                      <p className="text-sm text-muted-foreground">TechCorp Inc. • 2020 - Present</p>
                      <p className="text-sm text-foreground mt-2">
                        Led frontend development team and implemented React-based applications with TypeScript.
                      </p>
                    </div>
                    <div className="border-l-4 border-muted pl-4">
                      <h4 className="font-semibold text-foreground">Frontend Developer</h4>
                      <p className="text-sm text-muted-foreground">StartupXYZ • 2018 - 2020</p>
                      <p className="text-sm text-foreground mt-2">
                        Developed responsive web applications using React and modern CSS frameworks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <NotesWithMentions 
                candidate={candidate}
                onAddNote={handleAddNote}
              />
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Resume.pdf</p>
                          <p className="text-sm text-muted-foreground">Updated 2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {candidate.linkedin && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">LinkedIn Profile</p>
                            <p className="text-sm text-muted-foreground">{candidate.linkedin}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit
                        </Button>
                      </div>
                    )}
                    
                    {candidate.portfolio && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">Portfolio Website</p>
                            <p className="text-sm text-muted-foreground">{candidate.portfolio}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">{candidate.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Applied Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Last Activity</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(candidate.lastActivity).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Separator />
              <Button className="w-full gradient-primary text-white">
                <ChevronRight className="w-4 h-4 mr-2" />
                Move to Next Stage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <AddCandidateDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingCandidate={candidate}
        onEditComplete={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
};
