import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ completion }) => {
  return (
    <div className="progress-container">
      {Object.keys(completion).map((topic) => (
        <div key={topic} className="progress-bar">
          <h4>{topic}</h4>
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${completion[topic]}%` }}
            ></div>
          </div>
          <span>{completion[topic]}%</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
