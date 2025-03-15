
import React, { useState, useEffect } from 'react';
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
import { Team } from '../hooks/useTeams';

interface EditTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTeam: (id: string, name: string) => void;
  team: Team | null;
  isUpdating: boolean;
}

export function EditTeamDialog({ 
  isOpen, 
  onClose, 
  onUpdateTeam, 
  team, 
  isUpdating 
}: EditTeamDialogProps) {
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
    }
  }, [team]);

  const handleUpdateTeam = () => {
    if (team && teamName.trim()) {
      onUpdateTeam(team.id, teamName.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update your team's information.
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
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateTeam}
            disabled={!teamName.trim() || isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
