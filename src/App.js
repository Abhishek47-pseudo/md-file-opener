import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';
import CodeBlock from './components/CodeBlock';
import TableOfContents from './components/TableOfContents';
import DocumentStats from './components/DocumentStats';
import SearchBar from './components/SearchBar';

const RECENT_API = process.env.REACT_APP_RECENT_API || 'http://localhost:4000';

function App() {
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Viewer\n\nUpload or drag & drop a markdown file to get started!');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize') || '16'));
  const [showTOC, setShowTOC] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentFiles, setRecentFiles] = useState(() => JSON.parse(localStorage.getItem('recentFiles') || '[]'));
  const [searchTerm, setSearchTerm] = useState('');
  const [headings, setHeadings] = useState([]);
  const [sections, setSections] = useState([]);
  const bm25Ref = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showStats, setShowStats] = useState(true);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  // Extract headings from markdown
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [];
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2];
      matches.push({ level, text, id: text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') });
    }
    setHeadings(matches);
    // build sections for BM25: split by headings
    const buildSections = () => {
      const lines = markdown.split(/\r?\n/);
      const sec = [];
      const headingLineRe = /^(#{1,6})\s+(.+)$/;
      let current = { id: 'intro', title: 'Introduction', text: '' };
      for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        const h = ln.match(headingLineRe);
        if (h) {
          // push previous if has content
          if ((current.text || '').trim().length > 0 || current.title) sec.push({ ...current });
          const title = h[2].trim();
          const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          current = { id, title, text: '' };
        } else {
          current.text += ln + '\n';
        }
      }
      if ((current.text || '').trim().length > 0 || current.title) sec.push({ ...current });
      return sec;
    };

    const built = buildSections();
    setSections(built);
  }, [markdown]);

  // build BM25 index when sections change
  useEffect(() => {
    import('./utils/bm25').then(mod => {
      const BM25 = mod.default;
      if (sections.length === 0) {
        bm25Ref.current = null;
        return;
      }
      const docs = sections.map(s => ({ id: s.id, title: s.title, text: `${s.title}\n${s.text}` }));
      bm25Ref.current = new BM25(docs);
    }).catch(() => { bm25Ref.current = null; });
  }, [sections]);

  // run search with debounce
  useEffect(() => {
    const handle = setTimeout(() => {
      const q = (searchTerm || '').trim();
      if (!q || !bm25Ref.current) {
        setSearchResults([]);
        return;
      }
      const raw = bm25Ref.current.search(q, 12);
      const results = raw.map(r => {
        const sec = sections.find(s => s.id === r.id) || { title: r.id, text: '' };
        // snippet around first occurrence
        const idx = (sec.text || '').toLowerCase().indexOf(q.toLowerCase());
        let snippet = '';
        if (idx >= 0) snippet = sec.text.substr(Math.max(0, idx - 40), 160).replace(/\n/g, ' ');
        else snippet = (sec.text || '').substr(0, 160).replace(/\n/g, ' ');
        return { id: r.id, title: sec.title, score: r.score, snippet };
      });
      setSearchResults(results);
    }, 190);
    return () => clearTimeout(handle);
  }, [searchTerm, sections]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'k') {
          e.preventDefault();
          document.querySelector('.file-input')?.click();
        }
        if (e.key === 'f') {
          e.preventDefault();
          document.querySelector('.search-input')?.focus();
        }
        if (e.key === 'p') {
          e.preventDefault();
          window.print();
        }
      }
      if (e.key === 'Escape') {
        setSearchTerm('');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Try to load recent files from backend (Redis) on mount, fallback to localStorage
  useEffect(() => {
    let mounted = true;
    fetch(`${RECENT_API}/recent`).then(r => r.json()).then(data => {
      if (!mounted) return;
      if (Array.isArray(data) && data.length > 0) {
        setRecentFiles(data);
        localStorage.setItem('recentFiles', JSON.stringify(data));
      }
    }).catch(() => {
      // ignore - localStorage already has fallback
    });
    return () => { mounted = false; };
  }, []);

  const postRecentFile = async (fileMeta) => {
    try {
      await fetch(`${RECENT_API}/recent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileMeta),
      });
    } catch (e) {
      // ignore, keep localStorage fallback
    }
  };

   const handleFileUpload = (file) => {
     if (file && (file.name.endsWith('.md') || file.type === 'text/plain')) {
       const reader = new FileReader();
       reader.onload = (e) => {
         setMarkdown(e.target.result);
         setFileName(file.name);

         // Add to recent files
         const newRecentFiles = [{ name: file.name, time: new Date().toLocaleString() }, ...recentFiles.filter(f => f.name !== file.name)].slice(0, 5);
         setRecentFiles(newRecentFiles);
         localStorage.setItem('recentFiles', JSON.stringify(newRecentFiles));
         postRecentFile(newRecentFiles[0]);
       };
       reader.readAsText(file);
     } else {
       alert('Please upload a .md or text file');
     }
   };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    alert('Markdown copied to clipboard!');
  };

  const exportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fileName || 'Document'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #667eea; border-bottom: 2px solid #667eea; }
    code { background: #2d3748; color: #e2e8f0; padding: 2px 6px; border-radius: 3px; }
    pre { background: #2d3748; color: #e2e8f0; padding: 12px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #667eea; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
    th { background: #667eea; color: white; }
  </style>
</head>
<body>
  <h1>${fileName || 'Markdown Document'}</h1>
  ${renderMarkdownToHTML(markdown)}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(fileName || 'document').replace('.md', '')}.html`;
    a.click();
  };

  const renderMarkdownToHTML = (md) => {
    return md
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
      .split('\n')
      .join('<br>');
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`} style={{ '--font-size': `${fontSize}px` }}>
      <header className="header">
        <div className="header-left">
          <h1>📝 Beautiful Markdown Viewer</h1>
          <p>View your markdown files with style</p>
        </div>
        <div className="header-controls">
          <button
            className={`icon-btn sidebar-toggle-btn ${sidebarOpen ? 'open' : 'closed'}`}
            onClick={() => setSidebarOpen(s => !s)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? '🡸' : '🡺'}
          </button>
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="font-controls">
            <button className="icon-btn" onClick={() => setFontSize(Math.max(12, fontSize - 2))} title="Decrease font size">A−</button>
            <span className="font-size-display">{fontSize}px</span>
            <button className="icon-btn" onClick={() => setFontSize(Math.min(28, fontSize + 2))} title="Increase font size">A+</button>
          </div>
        </div>
      </header>

      <div className={`container ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <aside className="sidebar">
          <div className="upload-section">
            <h3>Upload File</h3>
            <div
              className={`drag-drop ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="drag-drop-content">
                <div className="icon">📤</div>
                <p>Drag & drop your markdown file here</p>
                <p className="or">or</p>
                <label className="file-label">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileInput}
                    accept=".md,.txt,text/plain"
                    className="file-input"
                  />
                </label>
                <p className="shortcut">Ctrl+K</p>
              </div>
            </div>

            {fileName && (
              <div className="file-info">
                <p className="file-name">📄 {fileName}</p>
                <div className="file-actions">
                  <button className="action-btn" onClick={copyMarkdown} title="Copy raw markdown">📋 Copy</button>
                  <button className="action-btn" onClick={exportHTML} title="Export as HTML">💾 HTML</button>
                  <button className="action-btn" onClick={() => window.print()} title="Print (Ctrl+P)">🖨️ Print</button>
                </div>
              </div>
            )}

            {recentFiles.length > 0 && (
              <div className="recent-files">
                <h4>📂 Recent Files</h4>
                <ul>
                  {recentFiles.map((file, idx) => (
                    <li key={idx} title={file.time}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="sidebar-controls">
            <button
              className={`sidebar-toggle ${showTOC ? 'active' : ''}`}
              onClick={() => setShowTOC(!showTOC)}
              title="Toggle Table of Contents"
            >
              📑 TOC
            </button>
            <button
              className={`sidebar-toggle ${showStats ? 'active' : ''}`}
              onClick={() => setShowStats(!showStats)}
              title="Toggle Document Stats"
            >
              📊 Stats
            </button>
          </div>

          {showTOC && headings.length > 0 && (
            <TableOfContents headings={headings} onNavigate={() => { if (window.innerWidth < 768) setSidebarOpen(false); }} />
          )}
          {showStats && fileName && <DocumentStats markdown={markdown} />}
        </aside>

        <main className="main-content">
          {fileName && (
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              results={searchResults}
              onResultClick={(id) => {
                const el = document.getElementById(id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  el.setAttribute('tabindex', '-1');
                  el.focus({ preventScroll: true });
                }
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
            />
          )}

          <div className="markdown-viewer">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                h1: ({ children, ...props }) => (
                  <h1
                    id={children?.[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
                    {...props}
                  >
                    {children}
                  </h1>
                ),

                h2: ({ children, ...props }) => (
                  <h2
                    id={children?.[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
                    {...props}
                  >
                    {children}
                  </h2>
                ),

                h3: ({ children, ...props }) => (
                  <h3
                    id={children?.[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
                    {...props}
                  >
                    {children}
                  </h3>
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </main>
      </div>

      <footer className="footer">
        <p>💡 Keyboard shortcuts: Ctrl+K (open file) | Ctrl+F (search) | Ctrl+P (print) | Esc (clear search)</p>
      </footer>
    </div>
  );
}

export default App;
