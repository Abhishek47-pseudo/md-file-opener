import React from 'react';
import './TableOfContents.css';

const TableOfContents = ({ headings }) => {
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="toc-container">
      <h4>📑 Table of Contents</h4>
      <nav className="toc-nav">
        <ul>
          {headings.map((heading, idx) => (
            <li key={idx} style={{ marginLeft: `${(heading.level - 1) * 12}px` }}>
              <button
                className="toc-link"
                onClick={() => scrollToHeading(heading.id)}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
