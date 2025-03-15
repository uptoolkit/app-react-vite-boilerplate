
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CreateTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (name: string) => void;
  isCreating: boolean;
}

export function CreateTeamDialog({ 
  isOpen, 
  onClose, 
  onCreateTeam, 
  isCreating 
}: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState('');

  const handleCreateTeam = () => {
    if (teamName.trim()) {
      onCreateTeam(teamName.trim());
    }
  };

  const handleClose = () => {
    setTeamName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Add a new team to organize your projects.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTeam}
            disabled={!teamName.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
