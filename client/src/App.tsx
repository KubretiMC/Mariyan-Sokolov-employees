import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import { ApiResponse } from './types';

function App() {
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const data: ApiResponse = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Employee Collaboration Tracker</h1>
        <p>Find the pair of employees who worked together the longest</p>
      </header>
      
      <main className="App-main">
        <FileUpload onFileUpload={handleFileUpload} loading={loading} />
        
        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}
        
        {results && (
          <ResultsTable 
            longestCollaboration={results.longestCollaboration}
            allCollaborations={results.allCollaborations}
          />
        )}
      </main>
    </div>
  );
}

export default App;
