export interface Company {
  id: number;
  name: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  votingOpen: number;
  showResults: number;
  allowMultipleCampaigns: number;
}

export interface Period {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: number;
  linkedValueIds?: number[];
  linkedCollaboratorIds?: number[];
}

export interface Value {
  id: number;
  name: string;
  icon: string;
  image: string | null;
}

export interface Collaborator {
  id: number;
  name: string;
  email: string;
  isAdmin: number;
  isMaster?: number;
  avatar: string;
  area?: string;
}

export interface Recognition {
  id: number;
  fromId: number;
  toId: number;
  valueId: number;
  story: string;
  attachments?: string[];
  score: number | null;
  createdAt: string;
  fromName: string;
  fromAvatar: string;
  fromIsMaster?: number;
  toName: string;
  toAvatar: string;
  toIsMaster?: number;
  valueName: string;
  valueIcon: string;
  valueImage: string | null;
}

export interface Area {
  id: number;
  name: string;
}

export interface AppConfig {
  company: Company;
  values: Value[];
  collaborators: Collaborator[];
  periods: Period[];
  areas: Area[];
}
