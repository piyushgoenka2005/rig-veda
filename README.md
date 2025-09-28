# Rig Veda Explorer

An interactive web application for exploring the Rig Veda through modern visualization techniques, built for the RigVed Hackathon.

## 🎯 Features

### Core Functionality
- **Interactive Hymn Viewer**: Parallel pane display with Sanskrit, transliteration, and multiple translations
- **Deity Network Visualization**: 3D network graph showing relationships between Vedic deities using Three.js
- **Theme Explorer**: Interactive sliders to map themes across the corpus with real-time filtering
- **Concordance Search**: N-gram search, epithet exploration, and word relationship analysis
- **Study Mode**: Spaced repetition flashcards for learning verses, epithets, and meters
- **Playlist Builder**: Create and share curated collections of hymns

### Technical Highlights
- **React + TypeScript**: Modern, type-safe development
- **Three.js Integration**: 3D deity network visualization
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Responsive, beautiful design
- **Zustand**: Lightweight state management
- **Responsive Design**: Works on desktop and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rigveda-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Main navigation header
│   ├── Navigation.tsx  # Page navigation
│   └── Onboarding.tsx  # Tutorial component
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Landing page
│   ├── HymnViewer.tsx  # Hymn reading interface
│   ├── DeityNetwork.tsx # 3D deity visualization
│   ├── ThemeExplorer.tsx # Theme mapping interface
│   ├── Concordance.tsx # Search and analysis
│   ├── StudyMode.tsx   # Flashcards and learning
│   └── PlaylistBuilder.tsx # Playlist creation
├── store/              # State management
│   └── appStore.ts     # Zustand store
├── types/              # TypeScript definitions
│   └── vedic.ts        # Vedic data types
├── data/               # Sample data
│   └── sample-data.ts  # Rig Veda sample data
└── main.tsx           # Application entry point
```

## 🎨 Design Philosophy

### Visual Design
- **Vedic Color Palette**: Gold (#D4AF37), Saffron (#FF9933), Deep Brown (#2C1810)
- **Typography**: Playfair Display for headings, Noto Sans Devanagari for Sanskrit
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Responsive Layout**: Mobile-first design approach

### User Experience
- **Onboarding Tutorial**: First-time user guidance
- **Progressive Disclosure**: Information revealed as needed
- **Keyboard Navigation**: Full keyboard accessibility
- **Performance**: Optimized for smooth interactions

## 🔧 Technical Implementation

### State Management
- **Zustand**: Lightweight, TypeScript-friendly state management
- **Persistent State**: User preferences and study progress
- **Optimistic Updates**: Immediate UI feedback

### 3D Visualization
- **Three.js + React Three Fiber**: Declarative 3D scene management
- **OrbitControls**: Intuitive camera controls
- **Dynamic Positioning**: Algorithmic node placement
- **Interactive Elements**: Click-to-select functionality

### Data Architecture
- **TypeScript Interfaces**: Strongly typed data models
- **Modular Structure**: Separated concerns for hymns, deities, themes
- **Extensible Design**: Easy to add new data sources

## 📊 Data Sources

The application uses sample data representing the structure of the Rig Veda:
- **Hymns**: Sanskrit text, transliteration, translations
- **Deities**: Names, epithets, relationships
- **Themes**: Keywords, intensity mapping
- **Meters**: Poetic structure information
- **Rishis**: Composer information

*Note: This is a demonstration with sample data. A full implementation would integrate with comprehensive Rig Veda datasets.*

## 🎯 Hackathon Submission

### Key Features for Judging
1. **Design**: Beautiful, intuitive interface with Vedic aesthetics
2. **Usability**: Immediate value without reading documentation
3. **Performance**: Fast loading and smooth interactions
4. **Rigor**: Accurate references and proper citations
5. **Originality**: Novel approach to Vedic text exploration
6. **User Delight**: Engaging and educational experience

### Technical Achievements
- **3D Deity Network**: Unique visualization of divine relationships
- **Interactive Theme Mapping**: Real-time corpus exploration
- **Spaced Repetition**: Educational tool for learning
- **Responsive Design**: Works across all devices
- **Modern Tech Stack**: React, TypeScript, Three.js

## 🚀 Deployment

The application is designed to be deployed as a static site:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting service
3. No backend required - fully client-side application

### Recommended Hosting
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📝 License

This project is created for the RigVed Hackathon. Please respect the intellectual property of Vedic texts and translations.

## 🤝 Contributing

This is a hackathon submission. For questions or feedback, please contact the development team.

---

**Built with ❤️ for the RigVed Hackathon**

*Exploring ancient wisdom through modern technology*
