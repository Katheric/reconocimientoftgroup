export interface Company {
  id: number;
  name: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  votingOpen: number;
  showResults: number;
  slogan?: string;
}

export interface Period {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: number;
}

export interface Value {
  id: number;
  name: string;
  emoji: string;
  image: string | null;
}

export interface Collaborator {
  id: number;
  name: string;
  email: string;
  isAdmin: number;
  avatar: string;
  area?: string;
}

export interface Recognition {
  id: number;
  fromId: number;
  toId: number;
  valueId: number;
  story: string;
  score: number | null;
  createdAt: string;
  fromName: string;
  fromAvatar: string;
  toName: string;
  toAvatar: string;
  valueName: string;
  valueEmoji: string;
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
