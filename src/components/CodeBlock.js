import React, { useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import './CodeBlock.css';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'plaintext';

  let highlightedCode = children[0];
  try {
    highlightedCode = hljs.highlight(children[0], { language, ignoreIllegals: true }).value;
  } catch (error) {
    console.warn(`Failed to highlight code block with language ${language}`);
  }

  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(children[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = children[0].split('\n').length;
  const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="language-badge">{language}</span>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <div className="code-container">
        <div className="line-numbers">
          {lineNumbers.map((num) => (
            <div key={num} className="line-number">{num}</div>
          ))}
        </div>
        <pre>
          <code
            className={`hljs ${className}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
