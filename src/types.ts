export interface Server {
  url: string;
  label: string;
}

export interface Team {
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  league: string;
  team1: Team;
  team2: Team;
  kickoff_date: string;
  kickoff_time: string;
  match_date: string;
  match_time: string;
  duration: string;
  servers: Server[];
}
