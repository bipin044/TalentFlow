import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Users, MapPin, Clock, Briefcase, Edit, Archive, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useJobStore } from '@/store/useJobStore';
import { Job } from '@/store/useJobStore';
import { CreateJobDialog } from '@/components/jobs/CreateJobDialog';
import { JobDetailModal } from '@/components/jobs/JobDetailModal';
import { toast } from 'sonner';

const JobCard: React.FC<{ 
  job: Job; 
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  onDelete: (job: Job) => void;
  onView: (job: Job) => void;
}> = ({ job, onEdit, onArchive, onDelete, onView }) => {
  const navigate = useNavigate();
  const isDraggingRef = React.useRef(false);
  
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-red-100 text-red-800'; 
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    if (isDraggingRef.current) return;
    navigate(`/dashboard/jobs/${job.id}`);
  };
  
  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Card 
      className="card-elevated hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => {
        isDraggingRef.current = true;
        e.dataTransfer.setData('jobId', job.id);
        // Optional: reduce default drag image flicker
        if (e.dataTransfer.setDragImage) {
          const img = document.createElement('img');
          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+';
          e.dataTransfer.setDragImage(img, 0, 0);
        }
      }}
      onDragEnd={() => {
        // Delay to avoid click after drag
        setTimeout(() => { isDraggingRef.current = false; }, 0);
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle 
              className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors"
            >
              {job.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{job.department}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(job.status)}>
              {job.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(job); }}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(job); }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(job); }}>
                  <Archive className="w-4 h-4 mr-2" />
                  {job.status === 'archived' ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(job); }}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.type}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {job.applicantCount} applicants
            </div>
          </div>
          
          <p className="text-sm text-foreground line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {job.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {job.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Jobs: React.FC = () => {
  const { jobs, updateJob, deleteJob, reorderJobs } = useJobStore() as any;
  const navigate = useNavigate();
  const { jobId } = useParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Job['status']>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'applicantCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  const itemsPerPage = 9;

  // Get unique tags for filter
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    jobs.forEach(job => job.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesTag = tagFilter === 'all' || job.tags.includes(tagFilter);
      return matchesSearch && matchesStatus && matchesTag;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'applicantCount':
          aValue = a.applicantCount;
          bValue = b.applicantCount;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchQuery, statusFilter, tagFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Handle job actions
  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsCreateDialogOpen(true);
  };

  const handleArchiveJob = (job: Job) => {
    const nextStatus = job.status === 'archived' ? 'active' : 'archived';
    const previousStatus = job.status;
    // Optimistic update
    updateJob(job.id, { status: nextStatus });
    toast.success(`${nextStatus === 'archived' ? 'Archived' : 'Unarchived'} "${job.title}"`);
    // Example rollback hook if server fails (replace with real API call)
    // fetch('/api/jobs/status', { method: 'POST', body: JSON.stringify({ id: job.id, status: nextStatus })})
    //   .catch(() => { updateJob(job.id, { status: previousStatus }); toast.error('Failed to update. Rolled back.'); });
  };

  const handleDeleteJob = (job: Job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      deleteJob(job.id);
    }
  };

  const handleViewJob = (job: Job) => {
    // Navigate to URL so deep links and back button work
    navigate(`/dashboard/jobs/${job.id}`);
  };

  const handleDetailOpenChange = (open: boolean) => {
    setIsDetailModalOpen(open);
    if (!open) {
      // Close modal: navigate back to jobs list
      navigate('/dashboard/jobs');
      setSelectedJob(null);
    }
  };

  // Handle deep linking
  React.useEffect(() => {
    if (jobId) {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        setSelectedJob(job);
        setIsDetailModalOpen(true);
      }
    } else {
      setIsDetailModalOpen(false);
      setSelectedJob(null);
    }
  }, [jobId, jobs]);

  // Reorder helpers (optimistic)
  const performReorder = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    const currentOrder = [...jobs];
    const fromIndex = currentOrder.findIndex(j => j.id === draggedId);
    const toIndex = currentOrder.findIndex(j => j.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const prev = [...currentOrder];
    const [moved] = currentOrder.splice(fromIndex, 1);
    currentOrder.splice(toIndex, 0, moved);
    reorderJobs(currentOrder);
    // Example rollback if server fails
    // fetch('/api/jobs/reorder', { method: 'POST', body: JSON.stringify(currentOrder)})
    //   .catch(() => { reorderJobs(prev); toast.error('Failed to reorder. Rolled back.'); });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your job postings and track applications
          </p>
        </div>
        <Button 
          className="gradient-primary text-white shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, department, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="applicantCount">Applicants</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {jobs.filter(j => j.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {jobs.filter(j => j.status === 'draft').length}
              </p>
              <p className="text-sm text-muted-foreground">Draft Jobs</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {jobs.reduce((acc, job) => acc + job.applicantCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Applicants</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {new Set(jobs.map(j => j.location)).size}
              </p>
              <p className="text-sm text-muted-foreground">Locations</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Jobs Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        onDragOver={(e) => e.preventDefault()}
      >
        {paginatedJobs.map((job, idx) => (
          <div
            key={job.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const draggedId = e.dataTransfer.getData('jobId');
              if (draggedId) performReorder(draggedId, job.id);
            }}
          >
            <JobCard 
              job={job}
              onEdit={handleEditJob}
              onArchive={handleArchiveJob}
              onDelete={handleDeleteJob}
              onView={handleViewJob}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search criteria' : 'Start by creating your first job posting'}
          </p>
          {!searchQuery && (
            <Button 
              className="gradient-primary text-white"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Job
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateJobDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        editingJob={editingJob}
        onEditComplete={() => setEditingJob(null)}
      />
      
      <JobDetailModal
        open={isDetailModalOpen}
        onOpenChange={handleDetailOpenChange}
        job={selectedJob}
      />
    </div>
  );
};