
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Laptop, Pencil, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Project = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  team_id: string;
};

type Team = {
  id: string;
  name: string;
};

export default function TeamProjects() {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch team details
  const { data: team, isLoading: isTeamLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      if (!teamId) throw new Error('Team ID is required');
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
        
      if (error) throw error;
      return data as Team;
    },
    enabled: !!teamId && !!user
  });

  // Fetch projects query
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', teamId],
    queryFn: async () => {
      if (!teamId) throw new Error('Team ID is required');
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!teamId && !!user
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!teamId) throw new Error('Team ID is required');
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description: description || null,
          team_id: teamId
        })
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
      setIsCreateDialogOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating project",
        description: error.message || "There was an error creating the project.",
        variant: "destructive",
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name,
          description: description || null
        })
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
      setIsEditDialogOpen(false);
      setCurrentProject(null);
      toast({
        title: "Project updated",
        description: "The project has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating project",
        description: error.message || "There was an error updating the project.",
        variant: "destructive",
      });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
      setIsDeleteDialogOpen(false);
      setCurrentProject(null);
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting project",
        description: error.message || "There was an error deleting the project.",
        variant: "destructive",
      });
    }
  });

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProjectMutation.mutate({
        name: newProjectName.trim(),
        description: newProjectDescription.trim()
      });
    }
  };

  const handleUpdateProject = () => {
    if (currentProject && editProjectName.trim()) {
      updateProjectMutation.mutate({
        id: currentProject.id,
        name: editProjectName.trim(),
        description: editProjectDescription.trim()
      });
    }
  };

  const handleDeleteProject = () => {
    if (currentProject) {
      deleteProjectMutation.mutate(currentProject.id);
    }
  };

  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setEditProjectName(project.name);
    setEditProjectDescription(project.description || '');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setCurrentProject(project);
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
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/teams">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold">
              {isTeamLoading ? <Skeleton className="h-8 w-48" /> : team?.name}
            </h1>
            <p className="text-muted-foreground">Projects</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <motion.h2 
            className="text-xl font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            All Projects
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </motion.div>
        </div>
        
        {/* Projects Grid */}
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
                  <Skeleton className="h-4 w-1/2 mt-2" />
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
                <h3 className="text-lg font-medium">Error loading projects</h3>
                <p className="text-muted-foreground">Please try again later.</p>
              </div>
            </div>
          ) : projects && projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Button variant="outline">
                      <Laptop className="mr-2 h-4 w-4" />
                      View Project
                    </Button>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => openDeleteDialog(project)}
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
                <Laptop className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground">Create a project to get started.</p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="project-description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Project description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={createProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project's information.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="edit-project-name"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
                placeholder="Project name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-project-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="edit-project-description"
                value={editProjectDescription}
                onChange={(e) => setEditProjectDescription(e.target.value)}
                placeholder="Project description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProject}
              disabled={!editProjectName.trim() || updateProjectMutation.isPending}
            >
              {updateProjectMutation.isPending ? 'Updating...' : 'Update Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={deleteProjectMutation.isPending}
            >
              {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
