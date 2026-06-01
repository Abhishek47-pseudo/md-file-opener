import React from 'react';
import './DocumentStats.css';

const DocumentStats = ({ markdown }) => {
  const wordCount = markdown.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = markdown.length;
  const lineCount = markdown.split('\n').length;
  const codeBlockCount = (markdown.match(/```/g) || []).length / 2;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  const stats = [
    { label: 'Words', value: wordCount, icon: '📝' },
    { label: 'Characters', value: charCount, icon: '🔤' },
    { label: 'Lines', value: lineCount, icon: '📏' },
    { label: 'Code Blocks', value: Math.floor(codeBlockCount), icon: '💻' },
    { label: 'Reading Time', value: `${readingTime}m`, icon: '⏱️' },
  ];

  return (
    <div className="stats-container">
      <h4>📊 Document Stats</h4>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentStats;
