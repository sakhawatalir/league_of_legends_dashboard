export interface SeriesMatch {
  id: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  tournament: {
    id: string;
    name: string;
  };
  teams: {
    id: string;
    name: string;
  }[];
}
