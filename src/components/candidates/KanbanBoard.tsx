import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Star, 
  MapPin, 
  Briefcase, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Plus
} from 'lucide-react';
import { Candidate } from '@/store/useCandidateStore';

interface KanbanColumnProps {
  title: string;
  stage: Candidate['stage'];
  candidates: Candidate[];
  onMoveStage: (candidate: Candidate, newStage: Candidate['stage']) => void;
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

interface KanbanCardProps {
  candidate: Candidate;
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ candidate, onView, onEdit, onDelete }) => {
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
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-move group bg-white"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('candidateId', candidate.id);
        e.dataTransfer.setData('candidateData', JSON.stringify(candidate));
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={candidate.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate text-sm">{candidate.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(candidate)}>
                    <Eye className="w-3 h-3 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(candidate)}>
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(candidate)} className="text-destructive">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-2.5 h-2.5 ${i < candidate.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-20">{candidate.location.split(',')[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {candidate.experience}y
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 2).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs px-1.5 py-0.5">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{candidate.skills.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  stage, 
  candidates, 
  onMoveStage, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const getColumnColor = (stage: Candidate['stage']) => {
    switch (stage) {
      case 'applied': return 'border-blue-200 bg-blue-50/50';
      case 'screening': return 'border-yellow-200 bg-yellow-50/50';
      case 'interview': return 'border-purple-200 bg-purple-50/50';
      case 'offer': return 'border-green-200 bg-green-50/50';
      case 'hired': return 'border-emerald-200 bg-emerald-50/50';
      case 'rejected': return 'border-red-200 bg-red-50/50';
      default: return 'border-gray-200 bg-gray-50/50';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    const candidateData = JSON.parse(e.dataTransfer.getData('candidateData') || '{}');
    
    if (candidateData && candidateData.stage !== stage) {
      onMoveStage(candidateData, stage);
    }
  };

  return (
    <div className="flex-1 min-w-0 max-w-80">
      <div 
        className={`rounded-lg border-2 border-dashed ${getColumnColor(stage)} min-h-[600px]`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <Badge variant="secondary" className="text-xs">
              {candidates.length}
            </Badge>
          </div>
          
          <ScrollArea className="h-[520px]">
            <div className="space-y-3 pr-2">
              {candidates.map((candidate) => (
                <KanbanCard
                  key={candidate.id}
                  candidate={candidate}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              
              {candidates.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Drop candidates here
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  candidates: Candidate[];
  onMoveStage: (candidate: Candidate, newStage: Candidate['stage']) => void;
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onMoveStage,
  onView,
  onEdit,
  onDelete
}) => {
  // Group candidates by stage
  const candidatesByStage = useMemo(() => {
    const groups = {
      applied: [] as Candidate[],
      screening: [] as Candidate[],
      interview: [] as Candidate[],
      offer: [] as Candidate[],
      hired: [] as Candidate[],
      rejected: [] as Candidate[],
    };
    
    candidates.forEach(candidate => {
      groups[candidate.stage].push(candidate);
    });
    
    return groups;
  }, [candidates]);

  const columns = [
    { title: 'Applied', stage: 'applied' as const, candidates: candidatesByStage.applied },
    { title: 'Screening', stage: 'screening' as const, candidates: candidatesByStage.screening },
    { title: 'Interview', stage: 'interview' as const, candidates: candidatesByStage.interview },
    { title: 'Offer', stage: 'offer' as const, candidates: candidatesByStage.offer },
    { title: 'Hired', stage: 'hired' as const, candidates: candidatesByStage.hired },
    { title: 'Rejected', stage: 'rejected' as const, candidates: candidatesByStage.rejected },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.stage}
          title={column.title}
          stage={column.stage}
          candidates={column.candidates}
          onMoveStage={onMoveStage}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
