import { Moment } from 'moment';

export interface CSVRow {
  EmpID: string;
  ProjectID: string;
  DateFrom: string;
  DateTo: string;
}

export interface EmployeeProject {
  projectId: string;
  dateFrom: Moment;
  dateTo: Moment;
}

export interface ProjectCollaboration {
  projectId: string;
  daysWorked: number;
}

export interface Collaboration {
  emp1: string;
  emp2: string;
  totalDays: number;
  projects: ProjectCollaboration[];
}

export interface EmployeeProjects {
  [empId: string]: EmployeeProject[];
}