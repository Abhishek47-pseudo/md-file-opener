# Beautiful Markdown Viewer

A modern, feature-rich markdown document viewer built with React, designed for developers, students, and technical writers who need a beautiful reading experience for markdown files.

Transform plain .md files into an interactive documentation experience with syntax highlighting, intelligent navigation, search capabilities, responsive layouts, and a polished user interface inspired by modern documentation platforms.


🚀 Live Demo

🌐 Try it now: https://md-file-opener.vercel.app

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev)
[![Node](https://img.shields.io/badge/Node-14+-green.svg)](https://nodejs.org)

## Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Customization](#customization)
- [Technologies](#technologies-used)
- [Project Structure](#project-structure)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- 📝 **Beautiful UI** - Modern, gradient-based design with smooth animations  
- 🎨 **Full Markdown Support** - GitHub Flavored Markdown (GFM) with all formatting
- 💻 **Syntax Highlighting** - Code blocks with 190+ languages, line numbers, and copy buttons
- 📤 **Drag & Drop** - Easy file upload via drag/drop or file browser
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎯 **Copy to Clipboard** - One-click code block copying with visual feedback

### Advanced Features
- 🌙 **Dark Mode** - Toggle between light and dark themes (preference saved)
- 🔤 **Font Size Control** - Adjust text size from 12px to 28px (preference saved)
- 📑 **Table of Contents** - Auto-generated TOC with smooth scrolling to headers
- 📊 **Document Statistics** - Word count, character count, reading time, code blocks
- 🔍 **Search/Find** - Search within documents with Ctrl+F
- 📋 **Copy Markdown** - Export raw markdown text to clipboard
- 💾 **Export to HTML** - Download rendered markdown as standalone HTML
- 🖨️ **Print Support** - Beautiful print layout without UI clutter
- ⏱️ **Keyboard Shortcuts** - Quick access to common functions
- 📂 **Recent Files** - Track and see recently opened files
- ⌨️ **Keyboard Navigation** - Full keyboard support for accessibility

## 🚀 Quick Start

### Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org))
- **npm** or **yarn** (included with Node.js)

### Installation

```bash
# Clone or navigate to the project directory
cd "md file opene"

# Install dependencies
npm install

# Start the development server
npm start
```

The app will automatically open at `http://localhost:3000`

### Production Build

```bash
# Create an optimized production build
npm run build

# Build runs at 1/3 the size with better performance
```

## 🧩 Redis + Backend Setup

This project supports Redis-backed recent file storage using an Express backend.

1. Install Redis on your machine and start it locally.
   - macOS: `brew install redis && brew services start redis`
   - Windows: use the Redis MSI installer or WSL.
   - Linux: use your package manager, e.g. `sudo apt install redis-server`.

2. Start the backend server:
```bash
cd server
npm install
npm start
```

   The backend listens at `http://localhost:4000` by default.

3. Start the frontend application in a separate terminal:
```bash
cd "md file opene"
npm install
npm start
```

4. Open the app in your browser at `http://localhost:3000`.

The frontend will use the backend to persist recently opened files in Redis, with `localStorage` as a fallback if the backend is unavailable.

## 📖 Usage

### Opening Files

1. Click **"Browse Files"** button or drag & drop a `.md` or `.txt` file
2. File renders instantly with beautiful styling
3. Supports both local files and remote markdown content

### Customization Options

| Feature | How to Access | Notes |
|---------|---------------|-------|
| **Dark Mode** | Click 🌙 in header | Saved to localStorage |
| **Font Size** | Use A− and A+ buttons | Range: 12px - 28px, saved |
| **Table of Contents** | Click 📑 button | Auto-generated from headings |
| **Document Stats** | Click 📊 button | Shows reading metrics |
| **Search** | Press Ctrl+F | Find text in document |
| **Copy Code** | Click button on code block | Shows "Copied!" feedback |

### Keyboard Shortcuts

| Shortcut | Action | Notes |
|----------|--------|-------|
| `Ctrl+K` | Open file browser | Works on Windows & Mac (Cmd+K) |
| `Ctrl+F` | Focus search box | Global search in document |
| `Ctrl+P` | Print document | Hides sidebar for clean layout |
| `Esc` | Clear search | Clears search field |

### File Actions

Once a file is loaded, access these buttons in the sidebar:

- **📋 Copy** - Copy raw markdown to clipboard
- **💾 HTML** - Export as standalone HTML file
- **🖨️ Print** - Print with optimized layout

## 🎨 Supported Markdown Features

- ✅ Headings (H1 - H6)
- ✅ **Bold** and *italic* text
- ✅ ~~Strikethrough~~
- ✅ Lists (ordered and unordered)
- ✅ [Links](https://example.com) and ![Images](url)
- ✅ Code blocks with syntax highlighting
- ✅ `Inline code`
- ✅ > Blockquotes
- ✅ Tables with formatting
- ✅ Horizontal rules (---)
- ✅ Task lists
- ✅ Footnotes

### Language Support

Syntax highlighting available for 190+ languages:
- **Web**: JavaScript, TypeScript, HTML, CSS, Vue, React
- **Backend**: Python, Java, C++, C#, Go, Rust, Ruby, PHP, Kotlin
- **Data**: JSON, YAML, TOML, XML, SQL
- **And many more!**

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | ^18.2.0 |
| **react-markdown** | Markdown parser | ^8.0.7 |
| **remark-gfm** | GitHub Flavored Markdown | ^3.0.1 |
| **highlight.js** | Code syntax highlighting | ^11.8.0 |
| **CSS3** | Styling with variables | - |

## 📁 Project Structure

```
md-viewer/
├── server/                      # Express + Redis backend for recent-files storage
│   ├── index.js                 # Express server implementation
│   └── package.json             # Backend dependencies and run scripts
├── src/
│   ├── App.js                    # Main app component (290 lines)
│   ├── App.css                   # Global styles & dark mode (500+ lines)
│   ├── index.js                  # React entry point
│   └── components/
│       ├── CodeBlock.js          # Syntax highlighting + line numbers
│       ├── CodeBlock.css         # Code block styling
│       ├── TableOfContents.js    # Auto TOC with scrolling
│       ├── TableOfContents.css   # TOC styling
│       ├── DocumentStats.js      # Statistics component
│       ├── DocumentStats.css     # Stats styling
│       ├── SearchBar.js          # Search functionality
│       └── SearchBar.css         # Search styling
├── public/
│   ├── index.html                # HTML template
│   └── favicon.ico               # App icon
├── package.json                  # Dependencies & scripts
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
└── sample.md                     # Example markdown file
```

## 🎯 Component Details

### App.js (Main Component)
- State management for markdown, preferences, and UI
- Keyboard shortcut handling
- File upload and export logic
- localStorage integration for persistence

### CodeBlock Component
- Language detection
- Automatic syntax highlighting via highlight.js
- Line numbers for reference
- Copy button with feedback
- Scrollable for long code blocks

### TableOfContents Component
- Automatic heading extraction
- Hierarchical display with indentation
- Smooth scroll-to-anchor functionality
- Click to navigate feature

### DocumentStats Component
- Real-time word/character counting
- Reading time estimation (200 WPM)
- Code block enumeration
- Visual stat cards

### SearchBar Component
- Case-insensitive search
- BM25-ranked result navigation
- Recent search result snippet preview

- Keyboard shortcuts
- Clear button with visual feedback
- Accessible form controls

## 🎓 Examples

### Dark Mode
```javascript
// Automatically toggled and saved
localStorage.getItem('darkMode') === 'true'
```

### Font Size Persistence
```javascript
// Saved preference
parseInt(localStorage.getItem('fontSize') || '16')
```

### Keyboard Handler
```javascript
// Ctrl+K opens file dialog
// Ctrl+F focuses search
// Ctrl+P prints
```

## 🔧 Customization

### Change Color Scheme

Edit the CSS variables in `src/App.css`:

```css
:root {
  --primary-color: #667eea;      /* Main color */
  --secondary-color: #764ba2;    /* Accent color */
  --background: #f7fafc;         /* Light background */
  --surface: #ffffff;            /* Card background */
  --text-primary: #2d3748;       /* Main text */
  --text-secondary: #718096;     /* Secondary text */
}
```

### Adjust Font Range

In `src/App.js`, modify the font size constraints:

```javascript
setFontSize(Math.max(12, fontSize - 2))  // Min font
setFontSize(Math.min(28, fontSize + 2))  // Max font
```

### Add New Code Languages

highlight.js automatically detects many languages. Add more via:

```bash
npm install highlight.js@latest
```

Then import additional language support as needed.

## 📊 Performance

- ⚡ **Fast Rendering** - React optimization and memoization
- 🚀 **Small Bundle** - Tree-shaking removes unused code
- 💾 **Efficient Storage** - Only preferences saved locally
- 🔄 **Smooth Animations** - Hardware-accelerated CSS transitions

## 🌐 Browser Compatibility

| Browser | Support | Version |
|---------|---------|---------|
| Chrome | ✅ Full | Latest |
| Firefox | ✅ Full | Latest |
| Safari | ✅ Full | Latest |
| Edge | ✅ Full | Latest |
| Mobile Chrome | ✅ Full | Latest |
| Mobile Safari | ✅ Full | Latest |

## 🤔 FAQ

### Q: Can I edit markdown in the app?
A: Currently, it's view-only. Editing mode is on the roadmap.

### Q: How large can uploaded files be?
A: Limited by your browser's memory, typically 50MB+.

### Q: Does it work offline?
A: Yes! After loading a file, everything works offline.

### Q: Can I change the theme colors?
A: Yes, edit the CSS variables in `src/App.css`.

### Q: Is my data stored on a server?
A: No! Everything stays in your browser. No data collection.

### Q: How do I export to PDF?
A: Use the Print feature (Ctrl+P) and "Save as PDF" in your browser.

### Q: Can I use this in production?
A: Absolutely! It's MIT licensed and production-ready.

## 🐛 Troubleshooting

### File won't upload
- ✅ Ensure file is `.md` or `.txt` format
- ✅ Check browser file access permissions
- ✅ Try drag-and-drop instead
- ✅ Clear browser cache and retry

### Dark mode not saving
- ✅ Verify localStorage is enabled
- ✅ Check browser privacy settings
- ✅ Try clearing cache and cookies

### Search not working
- ✅ Ensure a file is loaded first
- ✅ Try pressing Ctrl+F to focus
- ✅ Check console for errors (F12)

### Code blocks not highlighting
- ✅ Verify language is specified in markdown (```javascript)
- ✅ Check highlight.js is loaded (Network tab)
- ✅ Try refreshing the page

### Keyboard shortcuts not working
- ✅ Check if page has focus
- ✅ Verify OS (Cmd on Mac vs Ctrl on Windows)
- ✅ Check browser extensions aren't intercepting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🚀 Future Enhancements

- [ ] PDF export functionality
- [ ] Document editing mode
- [ ] Syntax validation and error detection
- [ ] Multi-tab support
- [ ] Cloud storage integration (Google Drive, OneDrive)
- [ ] Collaborative editing
- [ ] Custom theme builder
- [ ] Plugin system

## 📝 Development Notes

### Adding a New Feature

1. Create component in `src/components/`
2. Add corresponding `.css` file
3. Import in `App.js`
4. Update `README.md` with usage
5. Test keyboard shortcuts if applicable

### Testing Locally

```bash
# Development server with hot reload
npm start

# Build for production
npm run build

# Run tests (if added)
npm test
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use functional components and hooks
- Follow React best practices
- Keep components small and focused
- Add comments for complex logic
- Use meaningful variable names

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute it
- ✅ Use privately

The only requirement is to include the original copyright notice.

## 👏 Acknowledgments

- **highlight.js** - For excellent code syntax highlighting
- **React Markdown** - For reliable markdown parsing
- **GitHub** - For Flavored Markdown specification

## 📧 Support

For issues, questions, or suggestions:

1. Check the [FAQ](#-faq) section
2. Review [Troubleshooting](#-troubleshooting)
3. Open an [Issue](https://github.com/yourname/md-viewer/issues)
4. Submit a [Pull Request](https://github.com/yourname/md-viewer/pulls)

---

**Made with ❤️ for beautiful markdown viewing**

*Last updated: June 2026*

