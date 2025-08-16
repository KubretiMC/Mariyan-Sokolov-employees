# Development Guide

## Project Structure

```
├── package.json           # Root package.json with workspace scripts
├── sample-data.csv        # Sample CSV data for testing
├── uploads/              # Directory for uploaded CSV files
│   └── .gitkeep         # Keeps directory in git
├── server/              # Backend TypeScript Express server
│   ├── src/
│   │   ├── server.ts    # Express server with API endpoints
│   │   └── types.ts     # TypeScript type definitions
│   ├── dist/            # Compiled JavaScript output
│   ├── package.json     # Server dependencies
│   └── tsconfig.json    # TypeScript configuration
└── client/              # React TypeScript frontend
    ├── package.json     # Client dependencies
    ├── tsconfig.json    # TypeScript configuration
    ├── public/          # Static assets
    └── src/
        ├── App.tsx      # Main application component
        ├── types/       # TypeScript type definitions
        │   └── index.ts
        └── components/  # React components
            ├── FileUpload.tsx
            ├── FileUpload.css
            ├── ResultsTable.tsx
            └── ResultsTable.css
```

## Development Setup

1. **Install Dependencies**
   ```bash
   # Install all dependencies at once
   npm run install-all
   
   # Or install separately:
   # Server dependencies
   cd server && npm install
   
   # Client dependencies
   cd client && npm install
   ```

2. **Development Mode**
   ```bash
   # Run both server and client in development
   npm run dev
   
   # Or run separately:
   npm run server  # Server only (port 5000)
   npm run client  # Client only (port 3000)
   ```

3. **Production Build**
   ```bash
   # Build React app
   cd client && npm run build
   
   # Start production server
   npm start
   
   # Or use the startup script
   ./start.sh
   ```

## API Documentation

### POST /api/upload
Upload and process a CSV file to find employee collaborations.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: CSV file with field name `csvFile`

**Response:**
```json
{
  "longestCollaboration": {
    "emp1": "143",
    "emp2": "218",
    "totalDays": 220,
    "projects": [
      {
        "projectId": "12",
        "daysWorked": 36
      },
      {
        "projectId": "15", 
        "daysWorked": 184
      }
    ]
  },
  "allCollaborations": [...]
}
```

## CSV Format Requirements

The CSV file must have these columns:
- `EmpID`: Employee identifier
- `ProjectID`: Project identifier  
- `DateFrom`: Start date (various formats supported)
- `DateTo`: End date (NULL means current date)

**Supported Date Formats:**
- YYYY-MM-DD
- MM/DD/YYYY
- DD/MM/YYYY
- YYYY/MM/DD
- MM-DD-YYYY
- DD-MM-YYYY
- DD.MM.YYYY
- MM.DD.YYYY
- YYYY.MM.DD

## Testing

Use the included `sample-data.csv` file to test the application:

```bash
# Test API directly
curl -X POST -F "csvFile=@sample-data.csv" http://localhost:5000/api/upload

# Or use the web interface at http://localhost:5000
```

## TypeScript

The project uses TypeScript for full type safety:
- **Server**: TypeScript (Node.js + Express)
  - Source: `server/src/`
  - Types: `server/src/types.ts`
  - Build output: `server/dist/`
- **Client**: TypeScript/TSX (React)
  - Source: `client/src/`
  - Types: `client/src/types/index.ts`
  - Build output: `client/build/`

### Development Workflow
- **Server**: Uses `ts-node` for development, compiles to `dist/` for production
- **Client**: Uses `react-scripts` with TypeScript support
- **Shared Types**: Consider moving common types to a shared package for larger projects

## Git Workflow

The .gitignore files are configured to exclude:
- node_modules/
- Build artifacts (client/build/, dist/)
- Environment files (.env*)
- IDE files (.vscode/, .idea/)
- OS files (.DS_Store, Thumbs.db)
- Uploaded files (uploads/* except .gitkeep)
- TypeScript build info (*.tsbuildinfo)

## Troubleshooting

1. **Port conflicts**: Server runs on port 5000, client dev server on 3000
2. **CORS issues**: Client proxy is configured to forward API calls to server
3. **Build issues**: Ensure TypeScript version compatibility
4. **File upload issues**: Check uploads/ directory permissions