export interface RedirectProfile {
  id: string;
  active: boolean;
  probability: number;
  offerId: string;
  redirectProfileName: string;
  url: string;
  key: string;
  condition_type: string;
  redirectConditions: {
    valueCondition: string;
    reference_type: string;
    reference_action: string;
  }[];
}

export interface RedirectCondition {
  valueCondition: string;
  reference_type: string;
  reference_action: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  created_at: string;
  redirectProfiles: RedirectProfile[];
  campaigns: Campaign[];
}

export interface Campaign {
  key: string;
  name: string;
  status: string;
  created_at: string;
  time_zone: string;
  script: string;
  project_id: string;
  id: string;
  code: string;
}

export interface Refs {
  id: string;
  name: string;
  url: string;
}

export interface Database {
  projects: Project[];
  campaigns: Campaign[];
  refs: Refs[];
}
