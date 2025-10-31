# 3D Landscape Temple Explorer

An interactive 3D web application built with React Three Fiber, featuring a vast landscape with ancient temples dedicated to Rigvedic deities. Explore the terrain, interact with temple pillars to learn about Hindu mythology, and experience automatic day/night cycles with zodiac constellation patterns.

## Features

- **Immersive 3D Landscape**: Large-scale terrain with rolling hills and natural features
- **17 Temple Complexes**: Each dedicated to a different Rigvedic deity, distributed across the landscape
- **Interactive Deity Information**: Press 'E' near any temple or pillar to view detailed information about the deity
- **Animated Info Panels**: Beautiful CSS animations for deity information display
- **First-Person Navigation**: Free movement controls with sprint functionality
- **Automatic Day/Night Cycle**: Changes every 60 seconds with zodiac constellation patterns during night
- **Real-time Surface Tracking**: Temples, pillars, and player automatically adjust to terrain height

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Edge, or Safari)

## Quick Start

After deleting `node_modules`, follow these steps:

1. **Navigate to the viewer directory:**
   ```bash
   cd viewer
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - React (^19.1.1)
   - React Three Fiber (^9.4.0) - 3D rendering
   - Three.js (^0.180.0) - 3D graphics library
   - @react-three/drei (^10.7.6) - React Three Fiber helpers
   - Vite (^7.1.7) - Build tool and dev server

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the URL shown in terminal** (usually `http://localhost:5173`)

## Running the Application

### Development Mode

```bash
npm run dev
```

This will:
- Start the Vite development server
- Display the local URL (typically `http://localhost:5173`)
- Enable hot module replacement (changes reflect immediately)

### Production Build

To create an optimized production build:

```bash
npm run build
```

Then preview the production build:

```bash
npm run preview
```

### Using the Application

1. **Open your browser** to the URL shown in terminal (usually `http://localhost:5173`)
2. **Wait for models to load** - you'll see the 3D landscape appear
3. **Click "Enter View"** button at the bottom-left to enter first-person mode
4. **Start exploring!** Use W/A/S/D to move around

## Controls

- **Mouse Movement**: Look around (after clicking "Enter View")
- **W / ↑**: Move forward
- **S / ↓**: Move backward
- **A / ←**: Strafe left
- **D / →**: Strafe right
- **Shift**: Sprint (2x speed)
- **E**: Interact with temples/pillars (opens deity info panel)
  - Press **E again** to close the info panel
- **Escape**: Exit pointer lock mode

## Project Structure

```
landscpae/
├── viewer/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Styles and animations
│   │   └── main.jsx         # Application entry point
│   ├── public/
│   │   ├── landscape.glb    # 3D landscape model
│   │   ├── indian_temples.glb    # Temple 3D model
│   │   ├── muqarnas_-_pillar.glb # Pillar 3D model
│   │   └── rig_deities.json      # Deity information data
│   ├── package.json         # Project dependencies
│   └── vite.config.js       # Vite configuration
└── README.md                # This file
```

## Deities and Temples

The application features **17 temples**, each dedicated to a Rigvedic deity:

1. **Indra** - Storms, War, Kingship, Rain
2. **Agni** - Fire, Sacrifice, Communication
3. **Soma** - Ecstasy, Immortality, Inspiration
4. **Ashvins** - Healing, Dawn, Travel (Twin Deities)
5. **Varuna** - Cosmic Order, Ocean, Moral Law
6. **Maruts** - Storms, Battle (Deity Group)
7. **Mitra** - Friendship, Contracts, Harmony
8. **Ushas** - Dawn, Renewal, Light
9. **Vayu** - Wind, Breath, Vitality
10. **Savitr** - Solar Power, Inspiration
11. **Ribhus** - Skill, Artistry, Creation
12. **Pushan** - Travel, Cattle, Protection
13. **Apris** - Sacrificial Fires, Purification
14. **Brihaspati** - Wisdom, Ritual Speech
15. **Surya** - Sun, Vision, Illumination
16. **Dyaus and Prithivi** - Sky Father and Earth Mother
17. **Vāc** - Speech, Wisdom, Expression

Each temple is accompanied by a pillar that serves as the interaction point. Press 'E' near any pillar to learn about that deity.

## Building for Production

To create a production build:

```bash
npm run build
```

Or with yarn:
```bash
yarn build
```

This will create an optimized build in the `dist/` folder that can be deployed to any static hosting service.

## Troubleshooting

### Temples are floating above the ground
- The application uses raycasting to place temples on the surface
- Wait a few seconds for the landscape to fully load
- Check the browser console for any raycast warnings
- Refresh the page if temples don't settle correctly

### Models not loading
- Ensure all `.glb` files are in the `viewer/public/` directory:
  - `landscape.glb`
  - `indian_temples.glb`
  - `muqarnas_-_pillar.glb`
- Check that `rig_deities.json` is in `viewer/public/` directory
- Clear browser cache and hard refresh (Ctrl+F5 or Cmd+Shift+R)

### Controls not working
- Make sure you've clicked the "Enter View" button
- Check that your browser supports pointer lock API
- Try clicking on the canvas area first, then clicking "Enter View"

### Performance issues
- Lower the star count in night mode (edit `App.jsx`, search for `Stars count={15000}`)
- Reduce temple size if needed (edit `targetHeight` in `TempleWithPillar` component)
- Close other browser tabs to free up resources

## Technology Stack

- **React** - UI framework
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **@react-three/drei** - Useful helpers and abstractions
- **Vite** - Fast build tool and dev server
- **GLTF/GLB** - 3D model format

## Development Notes

- The landscape is scaled 5x larger than its original size
- Temples are 120 units tall (2x larger than default)
- Pillars are 20 units tall
- Player height is 20 units above ground
- Movement speed is 15 units/second (25 with sprint)
- Day/night cycle changes every 60 seconds automatically

## License

This project is for educational/exploration purposes.

## Credits

- 3D Models: Indian temples and muqarnas pillar models
- Deity Information: Based on Rigvedic texts and Hindu mythology

