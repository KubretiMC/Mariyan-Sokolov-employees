import React from 'react';
import './ResultsTable.css';
import { Collaboration } from '../types';

interface ResultsTableProps {
  longestCollaboration: Collaboration;
  allCollaborations: Collaboration[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ longestCollaboration, allCollaborations }) => {
  if (!longestCollaboration || longestCollaboration.totalDays === 0) {
    return (
      <div className="no-results">
        <p>No collaborations found in the uploaded data.</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="longest-collaboration">
        <h2>Longest Collaboration</h2>
        <div className="collaboration-summary">
          <p>
            <strong>Employee IDs:</strong> {longestCollaboration.emp1}, {longestCollaboration.emp2}
          </p>
          <p>
            <strong>Total Days Worked Together:</strong> {longestCollaboration.totalDays}
          </p>
        </div>
      </div>

      <div className="projects-table">
        <h3>Common Projects Details</h3>
        <table>
          <thead>
            <tr>
              <th>Employee ID #1</th>
              <th>Employee ID #2</th>
              <th>Project ID</th>
              <th>Days Worked</th>
            </tr>
          </thead>
          <tbody>
            {longestCollaboration.projects.map((project, index) => (
              <tr key={index}>
                <td>{longestCollaboration.emp1}</td>
                <td>{longestCollaboration.emp2}</td>
                <td>{project.projectId}</td>
                <td>{project.daysWorked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allCollaborations.length > 1 && (
        <div className="all-collaborations">
          <h3>All Employee Collaborations</h3>
          <table>
            <thead>
              <tr>
                <th>Employee ID #1</th>
                <th>Employee ID #2</th>
                <th>Total Days</th>
                <th>Number of Projects</th>
              </tr>
            </thead>
            <tbody>
              {allCollaborations
                .sort((a, b) => b.totalDays - a.totalDays)
                .map((collab, index) => (
                  <tr key={index} className={index === 0 ? 'highlight' : ''}>
                    <td>{collab.emp1}</td>
                    <td>{collab.emp2}</td>
                    <td>{collab.totalDays}</td>
                    <td>{collab.projects.length}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;