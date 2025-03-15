
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export type Team = {
  id: string;
  name: string;
  created_at: string;
};

export function useTeams() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch teams query
  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
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
  const createTeam = useMutation({
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
      toast({
        title: "Team created",
        description: "Your team has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Create team error:', error);
      toast({
        title: "Error creating team",
        description: error.message || "There was an error creating the team.",
        variant: "destructive",
      });
    }
  });

  // Update team mutation
  const updateTeam = useMutation({
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
      toast({
        title: "Team updated",
        description: "The team has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Update team error:', error);
      toast({
        title: "Error updating team",
        description: error.message || "There was an error updating the team.",
        variant: "destructive",
      });
    }
  });

  // Delete team mutation
  const deleteTeam = useMutation({
    mutationFn: async (id: string) => {
      // First delete team_members
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', id);
      
      if (membersError) throw membersError;
      
      // Then delete the team
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Delete team error:', error);
      toast({
        title: "Error deleting team",
        description: error.message || "There was an error deleting the team.",
        variant: "destructive",
      });
    }
  });

  return {
    teams: teamsQuery.data || [],
    isLoading: teamsQuery.isLoading,
    error: teamsQuery.error,
    createTeam,
    updateTeam,
    deleteTeam
  };
}
