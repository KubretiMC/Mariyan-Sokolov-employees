# Employee Collaboration Tracker

A Node.js and React TypeScript application that identifies pairs of employees who have worked together on common projects for the longest period of time.

## Features

- **File Upload**: Drag and drop or click to upload CSV files
- **Multiple Date Formats**: Supports various date formats (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, etc.)
- **NULL Date Handling**: Treats NULL DateTo values as today's date
- **Collaboration Analysis**: Finds overlapping work periods between employees on the same projects
- **Results Display**: Shows the longest collaboration pair and detailed project breakdown
- **TypeScript**: Full TypeScript support for type safety

## CSV Format

The application expects CSV files with the following columns:
```
EmpID,ProjectID,DateFrom,DateTo
143,12,2013-11-01,2014-01-05
218,10,2012-05-16,NULL
143,10,2009-01-01,2011-04-27
```

- **EmpID**: Employee ID (string/number)
- **ProjectID**: Project ID (string/number)  
- **DateFrom**: Start date (various formats supported)
- **DateTo**: End date (NULL means current date)

## Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   # Server dependencies
   cd server && npm install
   
   # Client dependencies  
   cd client && npm install
   ```

## Running the Application

### Development Mode
Run both server and client in development mode:
```bash
npm run dev
```

### Production Mode
1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:5000`

## API Endpoints

### POST /api/upload
Uploads and processes a CSV file.

**Request**: Multipart form data with `csvFile` field
**Response**: 
```json
{
  "longestCollaboration": {
    "emp1": "143",
    "emp2": "218", 
    "totalDays": 65,
    "projects": [
      {
        "projectId": "12",
        "daysWorked": 35
      }
    ]
  },
  "allCollaborations": [...]
}
```

## Sample Data

A sample CSV file (`sample-data.csv`) is included for testing purposes.

## Technology Stack

- **Backend**: Node.js, TypeScript, Express.js, Multer, CSV-Parser, Moment.js
- **Frontend**: React, TypeScript, CSS3

## Algorithm

1. Parse CSV data and handle various date formats
2. Group projects by employee ID
3. For each pair of employees, find common projects
4. For each common project, calculate overlapping work periods using date ranges.
5. Merge multiple rows of the same project for a pair to avoid double counting.
6. Sum total collaboration days across all common projects for the pair.
7. Return the pair(s) with the longest total collaboration time.
