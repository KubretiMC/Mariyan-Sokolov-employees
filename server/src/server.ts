import express, { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import moment, { Moment } from 'moment';
import { 
  CSVRow,  
  Collaboration, 
  EmployeeProjects
} from './types';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: '../uploads/' });

// Helper function to parse date in various formats
function parseDate(dateStr: string, fieldName: 'DateFrom' | 'DateTo'): Moment {
  if (!dateStr || dateStr.toLowerCase() === 'null' || dateStr.trim() === '') {
    if (fieldName === 'DateFrom') {
      throw new Error('DateFrom cannot be null or empty');
    }
    return moment(); // DateTo defaults to today for NULL values
  }

  const cleanDateStr = dateStr.trim();
  const formats = [
    'YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD',
    'MM-DD-YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'MM.DD.YYYY', 'YYYY.MM.DD'
  ];

  for (const format of formats) {
    const parsed = moment(cleanDateStr, format, true);
    if (parsed.isValid()) return parsed;
  }

  const defaultParsed = moment(cleanDateStr);
  if (defaultParsed.isValid()) return defaultParsed;

  throw new Error(`Invalid date format: ${dateStr}`);
}

// Calculate overlap between two date ranges
function calculateOverlap(start1: Moment, end1: Moment, start2: Moment, end2: Moment): number {
  const overlapStart = moment.max(start1, start2);
  const overlapEnd = moment.min(end1, end2);
  
  if (overlapStart.isSameOrBefore(overlapEnd)) {
    return overlapEnd.diff(overlapStart, 'days') + 1;
  }
  return 0;
}

// Process CSV data and find collaborations
function processEmployeeData(data: CSVRow[]): Collaboration[] {
  const collaborations = new Map<string, Collaboration>();
  const employeeProjects: EmployeeProjects = {};
  
  // Group projects by employee
  data.forEach(row => {
    const empId = row.EmpID.toString().trim();
    const projectId = row.ProjectID.toString().trim();
    const dateFrom = parseDate(row.DateFrom, 'DateFrom');
    const dateTo = parseDate(row.DateTo, 'DateTo');
    
    if (!employeeProjects[empId]) {
      employeeProjects[empId] = [];
    }
    
    employeeProjects[empId].push({
      projectId,
      dateFrom,
      dateTo
    });
  });
  
  // Find collaborations between employees
  const employees = Object.keys(employeeProjects);
  
  for (let i = 0; i < employees.length; i++) {
    for (let j = i + 1; j < employees.length; j++) {
      const emp1 = employees[i];
      const emp2 = employees[j];
      const emp1Projects = employeeProjects[emp1];
      const emp2Projects = employeeProjects[emp2];
      
      // Check for common projects
      emp1Projects.forEach(proj1 => {
        emp2Projects.forEach(proj2 => {
          if (proj1.projectId === proj2.projectId) {
            const collabKey = `${emp1}-${emp2}-${proj1.projectId}`;
            const overlap = calculateOverlap(
              proj1.dateFrom, proj1.dateTo,
              proj2.dateFrom, proj2.dateTo
            );
            
            if (overlap > 0) {
              if (!collaborations.has(collabKey)) {
                collaborations.set(collabKey, {
                  emp1,
                  emp2,
                  totalDays: 0,
                  projects: []
                });
              }
              
              const collab = collaborations.get(collabKey);
              if (collab) {
                collab.totalDays += overlap;
                collab.projects.push({
                  projectId: proj1.projectId,
                  daysWorked: overlap
                });
              }
            }
          }
        });
      });
    }
  }
  
  // At the end, merge same employee pairs across different projects:
  const merged = new Map<string, Collaboration>();
  for (const collab of collaborations.values()) {
    const pairKey = `${collab.emp1}-${collab.emp2}`;
    if (!merged.has(pairKey)) merged.set(pairKey, { emp1: collab.emp1, emp2: collab.emp2, totalDays: 0, projects: [] });
    const m = merged.get(pairKey)!;
    m.totalDays += collab.totalDays;

    // Only include unique projects (merge days if same project somehow repeated)
    collab.projects.forEach(p => {
      const existing = m.projects.find(pr => pr.projectId === p.projectId);
      if (existing) existing.daysWorked += p.daysWorked;
      else m.projects.push({ ...p });
    });
  }

  return Array.from(merged.values());
}

// API endpoint to process CSV file
app.post('/api/upload', upload.single('csvFile'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  
  const results: CSVRow[] = [];
  const filePath = req.file.path;
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      try {
        const collaborations = processEmployeeData(results);
        
        // Find the pair with longest collaboration
        const longestCollaboration = collaborations.reduce((max, current) => {
          return current.totalDays > max.totalDays ? current : max;
        }, { totalDays: 0 } as Collaboration);
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        
        res.json({
          longestCollaboration,
          allCollaborations: collaborations
        });
      } catch (error) {
        console.error('Error processing data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Error processing CSV data: ' + errorMessage });
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV:', error);
      res.status(500).json({ error: 'Error reading CSV file' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});