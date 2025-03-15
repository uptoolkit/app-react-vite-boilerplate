
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Team = {
  id: string;
  name: string;
  created_at: string;
};

export default function Teams() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch teams query
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      return data as Team[];
    },
    enabled: !!user
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('User not authenticated');
      
      // Insert team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({ name })
        .select('*')
        .single();
        
      if (teamError) throw teamError;
      
      // Insert user as admin of the team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData.id,
          user_id: user.id,
          role: 'admin'
        });
        
      if (memberError) throw memberError;
      
      return teamData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreateDialogOpen(false);
      setNewTeamName('');
      toast({
        title: "Team created",
        description: "Your team has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating team",
        description: error.message || "There was an error creating the team.",
        variant: "destructive",
      });
    }
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('teams')
        .update({ name })
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsEditDialogOpen(false);
      setCurrentTeam(null);
      toast({
        title: "Team updated",
        description: "The team has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating team",
        description: error.message || "There was an error updating the team.",
        variant: "destructive",
      });
    }
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsDeleteDialogOpen(false);
      setCurrentTeam(null);
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting team",
        description: error.message || "There was an error deleting the team.",
        variant: "destructive",
      });
    }
  });

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createTeamMutation.mutate(newTeamName.trim());
    }
  };

  const handleUpdateTeam = () => {
    if (currentTeam && editTeamName.trim()) {
      updateTeamMutation.mutate({ id: currentTeam.id, name: editTeamName.trim() });
    }
  };

  const handleDeleteTeam = () => {
    if (currentTeam) {
      deleteTeamMutation.mutate(currentTeam.id);
    }
  };

  const openEditDialog = (team: Team) => {
    setCurrentTeam(team);
    setEditTeamName(team.name);
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
        
        {/* Teams Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/3" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full flex items-center justify-center p-8 text-center">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">Error loading teams</h3>
                <p className="text-muted-foreground">Please try again later.</p>
              </div>
            </div>
          ) : teams && teams.length > 0 ? (
            teams.map((team) => (
              <Card key={team.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" asChild>
                      <Link to={`/teams/${team.id}/projects`}>
                        <Users className="mr-2 h-4 w-4" />
                        Projects
                      </Link>
                    </Button>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(team)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => openDeleteDialog(team)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center p-8 text-center">
              <div className="flex flex-col items-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No teams found</h3>
                <p className="text-muted-foreground">Create a team to get started.</p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Create Team Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Add a new team to organize your projects.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={createTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim() || createTeamMutation.isPending}
            >
              {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update your team's information.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editTeamName}
              onChange={(e) => setEditTeamName(e.target.value)}
              placeholder="Team name"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTeam}
              disabled={!editTeamName.trim() || updateTeamMutation.isPending}
            >
              {updateTeamMutation.isPending ? 'Updating...' : 'Update Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={deleteTeamMutation.isPending}
            >
              {deleteTeamMutation.isPending ? 'Deleting...' : 'Delete Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
