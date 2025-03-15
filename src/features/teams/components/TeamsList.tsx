
import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamCard } from './TeamCard';
import { Team } from '../hooks/useTeams';

interface TeamsListProps {
  teams: Team[];
  isLoading: boolean;
  error: Error | null;
  onCreateTeam: () => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
}

export function TeamsList({ 
  teams, 
  isLoading, 
  error, 
  onCreateTeam, 
  onEditTeam, 
  onDeleteTeam 
}: TeamsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">Error loading teams</h3>
          <p className="text-muted-foreground">{(error as Error).message || "Please try again later."}</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No teams found</h3>
          <p className="text-muted-foreground">Create a team to get started.</p>
          <Button className="mt-4" onClick={onCreateTeam}>
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {teams.map((team) => (
        <TeamCard 
          key={team.id} 
          team={team} 
          onEdit={onEditTeam} 
          onDelete={onDeleteTeam} 
        />
      ))}
    </motion.div>
  );
}
