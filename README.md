# 🌐 VeloWords Translate

Welcome to my **VeloWords Translate**, a lightweight and responsive translation application built to demonstrate clean code practices, DOM manipulation skills, and modern web development fundamentals.

This project is built with **Vanilla JavaScript, HTML5, and CSS3**, showcasing practical implementation without heavy frameworks.

---

## 🚀 Purpose

This project aims to:
1. **Demonstrate proficiency** in vanilla JavaScript and DOM manipulation.
2. **Showcase clean code architecture** with modular, maintainable components.
3. **Provide a real-world example** of integrating third-party APIs efficiently.
4. **Present responsive design** principles for modern web applications.

---

## ✨ Main Features

| Feature | Description |
|----------|-------------|
| 🔄 **Language Translation** | Translate text between multiple languages in real-time. |
| 🎨 **Responsive Design** | Fully responsive interface that works on desktop, tablet, and mobile. |
| ⚡ **Real-time Translation** | Instant translation as you type with debouncing for performance. |
| 🔊 **Smart UI** | Clean, intuitive interface with language selection and text management. |
| 🌙 **Light/Dark Mode** | Theme toggle for enhanced user experience (optional). |

---

## 🛠️ Tech Stack

- **Language:** Vanilla JavaScript (ES6+)
- **Markup:** HTML5
- **Styling:** CSS3 (Flexbox / Grid)
- **API Integration:** Google Translate API / Alternative Translation Service
- **DOM Manipulation:** Native JavaScript API
- **Architecture:** Modular, Component-based structure

---

## 📁 Folder Structure

```
google-translator/
├── index.html        # Main HTML structure
├── styles.css        # Global styles and responsive design
├── scripts.js        # Main application logic
├── dom.js            # DOM manipulation utilities
└── README.md         # Project documentation
```

### File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Application layout and semantic HTML markup |
| `styles.css` | Styling, layout, and responsive breakpoints |
| `scripts.js` | Core application logic and API integration |
| `dom.js` | Reusable DOM utility functions and helpers |

---

## 🎯 Code Principles

- **Separation of Concerns:** Logic separated into `scripts.js` and `dom.js`
- **Reusability:** DOM utilities in `dom.js` for DRY code
- **Readability:** Clear naming conventions and code comments
- **Performance:** Debouncing, efficient DOM queries, and event delegation
- **Accessibility:** Semantic HTML and ARIA attributes where applicable

---

## 🚀 Getting Started - Prerequisites

### Browser Support
This application uses the experimental On-device Translator API available in Chromium-based browsers.

### Supported
- ✅ Google Chrome (recommended)

### Experimental Support
- ⚠ Brave
- ⚠ Opera
- ⚠ Arc
- ⚠ Vivaldi

### Not Supported
- ❌ Microsoft Edge
- ❌ Firefox
- ❌ Safari

> Note: The Translator API is still experimental and may require enabling browser flags or using the latest Chrome version.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Juansegomezn/velowords-translate.git
   cd velowords-translate
   ```

2. **Open in browser:**
   - Double-click `index.html`, or
   - Use a local server:
     ```bash
     python -m http.server 8000
     # or
     npx http-server
     ```

3. **Access the application:**
   - Navigate to `http://localhost:8000`

---

## 💡 Key Features Implementation

### 1. **Real-time Translation**
- Debounced input handling to minimize API calls
- Efficient text processing and language detection
- Error handling and fallback mechanisms

### 2. **DOM Utilities (`dom.js`)**
Centralized functions for:
- Selecting elements

### 3. **Application Logic (`scripts.js`)**
- Language selection and switching
- API integration and error handling
- State management for current selections
- User interaction coordination

---

## 📋 Future Enhancements

- [✅] Add AI features: spelling suggestion with "Did you mean" UX (demo mode)
- [ ] Add offline translation support (via ML models)
- [ ] Support for more language pairs
- [ ] Unit tests with Jest
- [ ] Keyboard shortcuts for power users

---

## 🧪 Testing

Currently tested manually in modern browsers. Future integration:
- Unit tests for utility functions
- Integration tests for API calls
- E2E tests for user workflows

---

## 📄 License

This project is open source.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- Inspired by Google Translate's clean and intuitive interface
- Built to demonstrate practical vanilla JavaScript skills
- Part of my journey to master web development fundamentals

---

**Made by Juan Sebastian Gomez Ayala**
