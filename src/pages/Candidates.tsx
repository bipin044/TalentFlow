import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Briefcase,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  MessageSquare,
  FileText,
  ChevronRight,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CandidateDetailModal } from '@/components/candidates/CandidateDetailModal';
import { AddCandidateDialog } from '@/components/candidates/AddCandidateDialog';
import { VirtualizedCandidateList } from '@/components/candidates/VirtualizedCandidateList';
import { KanbanBoard } from '@/components/candidates/KanbanBoard';
import { CandidateProfile } from '@/components/candidates/CandidateProfile';
import { useCandidateStore, Candidate } from '@/store/useCandidateStore';
import { useCandidateSeedData } from '@/hooks/useCandidateSeedData';

const CandidateCard: React.FC<{ 
  candidate: Candidate; 
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  onMoveStage: (candidate: Candidate, newStage: Candidate['stage']) => void;
}> = ({ candidate, onView, onEdit, onDelete, onMoveStage }) => {
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

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{candidate.position}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStageColor(candidate.stage)}>
                    {candidate.stage}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < candidate.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(candidate)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(candidate)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(candidate)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {candidate.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {candidate.experience}y exp
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {candidate.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const KanbanColumn: React.FC<{
  title: string;
  stage: Candidate['stage'];
  candidates: Candidate[];
  onMoveStage: (candidate: Candidate, newStage: Candidate['stage']) => void;
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}> = ({ title, stage, candidates, onMoveStage, onView, onEdit, onDelete }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      onMoveStage(candidate, stage);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary">{candidates.length}</Badge>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div 
          className="space-y-3 p-2"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('candidateId', candidate.id)}
              className="cursor-move"
            >
              <CandidateCard
                candidate={candidate}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onMoveStage={onMoveStage}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const Candidates: React.FC = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams();
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  
  const { 
    moveCandidateStage, 
    deleteCandidate, 
    updateCandidate 
  } = useCandidateStore();
  
  // Initialize seed data
  const { candidates } = useCandidateSeedData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | Candidate['stage']>('all');
  const [positionFilter, setPositionFilter] = useState<string>(urlParams.get('position') || 'all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'virtualized'>('kanban');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  // If we're on a candidate profile page, show the profile component
  if (candidateId) {
    return <CandidateProfile />;
  }

  // Get unique positions for filter
  const allPositions = useMemo(() => {
    const positions = new Set<string>();
    candidates.forEach(candidate => positions.add(candidate.position));
    return Array.from(positions).sort();
  }, [candidates]);

  // Enhanced filter candidates with better search
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.position.toLowerCase().includes(searchLower) ||
        candidate.location.toLowerCase().includes(searchLower) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchLower));
      
      const matchesStage = stageFilter === 'all' || candidate.stage === stageFilter;
      const matchesPosition = positionFilter === 'all' || candidate.position === positionFilter;
      
      return matchesSearch && matchesStage && matchesPosition;
    });
  }, [candidates, searchQuery, stageFilter, positionFilter]);

  // Group candidates by stage for kanban view
  const candidatesByStage = useMemo(() => {
    const groups = {
      applied: [] as Candidate[],
      screening: [] as Candidate[],
      interview: [] as Candidate[],
      offer: [] as Candidate[],
      hired: [] as Candidate[],
      rejected: [] as Candidate[],
    };
    
    filteredCandidates.forEach(candidate => {
      groups[candidate.stage].push(candidate);
    });
    
    return groups;
  }, [filteredCandidates]);

  // Handle candidate actions
  const handleViewCandidate = (candidate: Candidate) => {
    navigate(`/dashboard/candidates/${candidate.id}`);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsAddDialogOpen(true);
  };

  const handleDeleteCandidate = (candidate: Candidate) => {
    if (window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      deleteCandidate(candidate.id);
    }
  };

  const handleMoveStage = (candidate: Candidate, newStage: Candidate['stage']) => {
    moveCandidateStage(candidate.id, newStage, `Moved from ${candidate.stage} to ${newStage}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Manage candidates and track their progress through the hiring pipeline
          </p>
        </div>
        <Button 
          className="gradient-primary text-white shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name, email, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={stageFilter} onValueChange={(value: any) => setStageFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {allPositions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {Object.entries(candidatesByStage).map(([stage, candidates]) => (
          <Card key={stage} className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{candidates.length}</div>
              <div className="text-sm text-muted-foreground capitalize">{stage}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <TabsList>
            <TabsTrigger value="kanban">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban Board
            </TabsTrigger>
            <TabsTrigger value="virtualized">
              <List className="w-4 h-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="list">
              <Users className="w-4 h-4 mr-2" />
              Grid View
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="text-sm text-muted-foreground">
          {filteredCandidates.length} of {candidates.length} candidates found
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {viewMode === 'kanban' && (
          <KanbanBoard
            candidates={filteredCandidates}
            onMoveStage={handleMoveStage}
            onView={handleViewCandidate}
            onEdit={handleEditCandidate}
            onDelete={handleDeleteCandidate}
          />
        )}
        
        {viewMode === 'virtualized' && (
          <VirtualizedCandidateList
            candidates={filteredCandidates}
            onView={handleViewCandidate}
            onEdit={handleEditCandidate}
            onDelete={handleDeleteCandidate}
            height={600}
          />
        )}
        
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onView={handleViewCandidate}
                onEdit={handleEditCandidate}
                onDelete={handleDeleteCandidate}
                onMoveStage={handleMoveStage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No candidates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first candidate'}
          </p>
          {!searchQuery && (
            <Button 
              className="gradient-primary text-white"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Candidate
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <CandidateDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        candidate={selectedCandidate}
      />
      
      <AddCandidateDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingCandidate={editingCandidate}
        onEditComplete={() => setEditingCandidate(null)}
      />
    </div>
  );
};