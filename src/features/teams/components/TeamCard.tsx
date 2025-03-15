
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Team } from '../hooks/useTeams';

interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  return (
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
              onClick={() => onEdit(team)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive/80"
              onClick={() => onDelete(team)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
