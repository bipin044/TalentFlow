import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, AtSign, User, Clock } from 'lucide-react';
import { Candidate } from '@/store/useCandidateStore';

// Mock team members for @mentions
const teamMembers = [
  { id: '1', name: 'John Smith', email: 'john@company.com', role: 'HR Manager' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Technical Lead' },
  { id: '3', name: 'Mike Davis', email: 'mike@company.com', role: 'Recruiter' },
  { id: '4', name: 'Emily Brown', email: 'emily@company.com', role: 'Engineering Manager' },
  { id: '5', name: 'David Wilson', email: 'david@company.com', role: 'Product Manager' },
];

interface NotesWithMentionsProps {
  candidate: Candidate;
  onAddNote: (note: string) => void;
}

export const NotesWithMentions: React.FC<NotesWithMentionsProps> = ({ 
  candidate, 
  onAddNote 
}) => {
  const [newNote, setNewNote] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  const filteredMembers = useMemo(() => {
    if (!mentionQuery) return teamMembers;
    return teamMembers.filter(member =>
      member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  }, [mentionQuery]);

  const handleNoteChange = (value: string) => {
    setNewNote(value);
    
    // Check for @ mentions
    const cursorPos = value.length;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ') && textAfterAt.length >= 0) {
        setMentionQuery(textAfterAt);
        setShowMentions(true);
        setCursorPosition(cursorPos);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (member: typeof teamMembers[0]) => {
    const lastAtIndex = newNote.lastIndexOf('@');
    const beforeMention = newNote.substring(0, lastAtIndex);
    const afterMention = newNote.substring(cursorPosition);
    const newText = `${beforeMention}@${member.name} ${afterMention}`;
    
    setNewNote(newText);
    setShowMentions(false);
    setMentionQuery('');
  };

  const handleSubmit = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };

  const renderNoteContent = (content: string) => {
    // Simple mention highlighting - in a real app, this would be more sophisticated
    const mentionRegex = /@(\w+\s?\w*)/g;
    const parts = content.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a mention
        const member = teamMembers.find(m => m.name.includes(part));
        return (
          <Badge key={index} variant="secondary" className="mx-1">
            <AtSign className="w-3 h-3 mr-1" />
            {part}
          </Badge>
        );
      }
      return part;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes & Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Existing Notes */}
          {candidate.notes.map((note, index) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    HR
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">HR Team</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(candidate.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-foreground">
                    {renderNoteContent(note)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Note */}
          <div className="border border-dashed border-muted rounded-lg p-4 relative">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <Textarea
                    placeholder="Add a note... Use @name to mention team members"
                    value={newNote}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        handleSubmit();
                      }
                    }}
                  />
                  
                  {/* Mention Suggestions */}
                  {showMentions && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                      {filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
                          onClick={() => handleMentionSelect(member)}
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                          </div>
                        </button>
                      ))}
                      {filteredMembers.length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No team members found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Use @name to mention team members • Ctrl+Enter to send
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleSubmit}
                    disabled={!newNote.trim()}
                    className="gradient-primary text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Members Reference */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              Team Members
            </div>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member) => (
                <Badge key={member.id} variant="outline" className="text-xs">
                  @{member.name.split(' ')[0].toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
