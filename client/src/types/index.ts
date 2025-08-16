export interface EmployeeProject {
  projectId: string;
  daysWorked: number;
}

export interface Collaboration {
  emp1: string;
  emp2: string;
  totalDays: number;
  projects: EmployeeProject[];
}

export interface ApiResponse {
  longestCollaboration: Collaboration;
  allCollaborations: Collaboration[];
}