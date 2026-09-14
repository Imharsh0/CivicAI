// ==============================================================================
// CIVICAI TYPE DEFINITIONS
// ==============================================================================

export type UserRole = 'user' | 'admin' | 'authority';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  organization_id?: string;
  created_at: string;
}

export type OrganizationType = 
  | 'Municipal Zone' 
  | 'College' 
  | 'School' 
  | 'Housing Society' 
  | 'Office' 
  | 'Community' 
  | 'Residential Society';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  city: string;
  state: string;
  created_at: string;
}

export type IssueCategory =
  | 'Road Infrastructure'
  | 'Solid Waste Management'
  | 'Water & Drainage'
  | 'Lighting & Electricity'
  | 'Public Infrastructure'
  | 'Environment & Greenery'
  | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';
export type IssueStatus = 'Reported' | 'Verified' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export interface CivicIssue {
  id: string;
  user_id?: string;
  organization_id?: string;
  image_url: string;
  issue_type: string;
  category: IssueCategory;
  description: string;
  location_text: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  priority_score: number; // 0 to 100
  priority_level: PriorityLevel;
  ai_confidence: number; // 0 to 100
  ai_explanation?: string;
  safety_impact?: string;
  suggested_action?: string;
  status: IssueStatus;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolution?: ResolutionEvidence;
}

export interface IssueUpdate {
  id: string;
  issue_id: string;
  user_id?: string;
  user_name?: string;
  status: IssueStatus;
  comment: string;
  created_at: string;
}

export interface ResolutionEvidence {
  id: string;
  issue_id: string;
  resolved_by?: string;
  resolved_by_name?: string;
  resolution_note: string;
  after_image_url: string;
  created_at: string;
}

export interface AIAnalysisResult {
  issue_type: string;
  category: IssueCategory;
  confidence: number;
  severity: SeverityLevel;
  priority_level: PriorityLevel;
  priority_score: number;
  explanation: string;
  safety_impact: string;
  suggested_action: string;
  is_demo?: boolean;
}

export interface CityInfo {
  name: string;
  hindiName: string;
  state: string;
  latitude: number;
  longitude: number;
  municipalBody: string;
}
