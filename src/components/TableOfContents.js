import React, { useEffect, useState, useRef } from 'react';
import './TableOfContents.css';

const TableOfContents = ({ headings, onNavigate }) => {
  const [activeId, setActiveId] = useState(null);
  const observerRef = useRef(null);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // update url hash without abrupt jump
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
      if (typeof onNavigate === 'function') onNavigate();
      // move keyboard focus for accessibility
      element.setAttribute('tabindex', '-1');
      element.focus({ preventScroll: true });
    }
  };

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) observerRef.current.disconnect();

    const headingElements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean);

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0, 0.1, 0.4, 0.9] }
    );

    headingElements.forEach(el => observerRef.current.observe(el));

    return () => observerRef.current && observerRef.current.disconnect();
  }, [headings]);

  return (
    <div className="toc-container" aria-label="Table of contents">
      <h4>📑 Table of Contents</h4>
      <nav className="toc-nav" aria-hidden={headings.length === 0}>
        <ul>
          {headings.map((heading, idx) => (
            <li key={idx} style={{ marginLeft: `${(heading.level - 1) * 12}px` }}>
              <button
                className={`toc-link ${activeId === heading.id ? 'active' : ''}`}
                onClick={() => scrollToHeading(heading.id)}
                aria-current={activeId === heading.id ? 'true' : undefined}
                aria-label={`Jump to ${heading.text}`}
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
