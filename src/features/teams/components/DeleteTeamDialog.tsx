
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Team } from '../hooks/useTeams';

interface DeleteTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteTeam: (id: string) => void;
  team: Team | null;
  isDeleting: boolean;
}

export function DeleteTeamDialog({ 
  isOpen, 
  onClose, 
  onDeleteTeam, 
  team, 
  isDeleting 
}: DeleteTeamDialogProps) {
  const handleDeleteTeam = () => {
    if (team) {
      onDeleteTeam(team.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this team? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteTeam}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
