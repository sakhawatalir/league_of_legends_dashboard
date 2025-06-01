export interface BaseTeam {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Team extends BaseTeam {
  externalLinks?: any[];
  rating?: number | null;
  colorPrimary?: string;
  colorSecondary?: string;
  private?: boolean;
  organization?: {
    id: string;
    name: string;
  } | null;
  titles?: { id: string; name: string }[];
}
