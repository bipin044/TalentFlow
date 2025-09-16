import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  MoreVertical,
  Calendar,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { AssessmentBuilder } from '@/components/assessments/AssessmentBuilder';
import { CreateAssessmentDialog } from '@/components/assessments/CreateAssessmentDialog';

export const Assessments: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const { 
    assessments, 
    currentAssessment, 
    setCurrentAssessment, 
    deleteAssessment, 
    duplicateAssessment,
    publishAssessment,
    unpublishAssessment,
    getResponsesForAssessment
  } = useAssessmentStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'published') return matchesSearch && assessment.isPublished;
    if (selectedTab === 'draft') return matchesSearch && !assessment.isPublished;
    
    return matchesSearch;
  });

  const handleCreateAssessment = () => {
    setShowCreateDialog(true);
  };

  const handleEditAssessment = (assessment: any) => {
    setCurrentAssessment(assessment);
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      deleteAssessment(assessmentId);
    }
  };

  const handleDuplicateAssessment = (assessmentId: string) => {
    duplicateAssessment(assessmentId);
  };

  const handlePublishAssessment = (assessmentId: string) => {
    publishAssessment(assessmentId);
  };

  const handleUnpublishAssessment = (assessmentId: string) => {
    unpublishAssessment(assessmentId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getTotalQuestions = (assessment: any) => {
    return assessment.sections.reduce((acc: number, section: any) => acc + section.questions.length, 0);
  };

  const getResponseCount = (assessmentId: string) => {
    return getResponsesForAssessment(assessmentId).length;
  };

  // If we're in builder mode, show the builder with a back button
  if (currentAssessment) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b">
          <Button variant="outline" size="sm" onClick={() => setCurrentAssessment(null)}>
            Back to Assessments
          </Button>
        </div>
        <AssessmentBuilder
        assessment={currentAssessment}
        onSave={() => {
          // Assessment is auto-saved via the store
          console.log('Assessment saved');
        }}
        onPublish={() => {
          publishAssessment(currentAssessment.id);
          setCurrentAssessment(null);
        }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage custom assessments for candidate evaluation
          </p>
        </div>
        <Button 
          className="gradient-primary text-white shadow-md hover:shadow-lg transition-all"
          onClick={handleCreateAssessment}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Assessments Grid */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{assessment.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {assessment.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditAssessment(assessment)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/assessments/${assessment.id}/preview`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateAssessment(assessment.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => assessment.isPublished ? handleUnpublishAssessment(assessment.id) : handlePublishAssessment(assessment.id)}
                      >
                        {assessment.isPublished ? (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" />
                    <span>{getTotalQuestions(assessment)} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{getResponseCount(assessment.id)} responses</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={assessment.isPublished ? "default" : "secondary"}>
                      {assessment.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(assessment.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditAssessment(assessment)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/dashboard/assessments/${assessment.id}/preview`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'No assessments found' : 'No assessments yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first assessment to get started'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateAssessment}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          )}
        </div>
      )}

      {/* Create Assessment Dialog */}
      <CreateAssessmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAssessmentCreated={(assessment) => {
          setCurrentAssessment(assessment);
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
};