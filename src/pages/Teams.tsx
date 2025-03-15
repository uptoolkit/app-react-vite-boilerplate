
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { TeamsList } from '@/features/teams/components/TeamsList';
import { CreateTeamDialog } from '@/features/teams/components/CreateTeamDialog';
import { EditTeamDialog } from '@/features/teams/components/EditTeamDialog';
import { DeleteTeamDialog } from '@/features/teams/components/DeleteTeamDialog';
import { useTeams, Team } from '@/features/teams/hooks/useTeams';

export default function Teams() {
  const { teams, isLoading, error, createTeam, updateTeam, deleteTeam } = useTeams();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const handleCreateTeam = (name: string) => {
    createTeam.mutate(name, {
      onSuccess: () => setIsCreateDialogOpen(false)
    });
  };

  const handleUpdateTeam = (id: string, name: string) => {
    updateTeam.mutate({ id, name }, {
      onSuccess: () => setIsEditDialogOpen(false)
    });
  };

  const handleDeleteTeam = (id: string) => {
    deleteTeam.mutate(id, {
      onSuccess: () => setIsDeleteDialogOpen(false)
    });
  };

  const openEditDialog = (team: Team) => {
    setCurrentTeam(team);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (team: Team) => {
    setCurrentTeam(team);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Teams
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          </motion.div>
        </div>
        
        <TeamsList 
          teams={teams}
          isLoading={isLoading}
          error={error as Error}
          onCreateTeam={() => setIsCreateDialogOpen(true)}
          onEditTeam={openEditDialog}
          onDeleteTeam={openDeleteDialog}
        />
      </motion.div>

      {/* Dialogs */}
      <CreateTeamDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTeam={handleCreateTeam}
        isCreating={createTeam.isPending}
      />

      <EditTeamDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdateTeam={handleUpdateTeam}
        team={currentTeam}
        isUpdating={updateTeam.isPending}
      />

      <DeleteTeamDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDeleteTeam={handleDeleteTeam}
        team={currentTeam}
        isDeleting={deleteTeam.isPending}
      />
    </DashboardLayout>
  );
}
