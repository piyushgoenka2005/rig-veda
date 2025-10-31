import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// Plugin to copy static HTML files to dist
function copyStaticHtml() {
  return {
    name: 'copy-static-html',
    closeBundle() {
      const filesToCopy = [
        { src: 'mandalas.html', dest: 'dist/mandalas.html' },
        { src: 'search.html', dest: 'dist/search.html' }
      ]
      
      const dirsToCopy = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'resources', 'rigveda-online']
      
      // Copy individual HTML files
      filesToCopy.forEach(({ src, dest }) => {
        try {
          if (existsSync(src)) {
            copyFileSync(src, dest)
            console.log(`Copied ${src} to ${dest}`)
          }
        } catch (err) {
          console.error(`Error copying ${src}:`, err)
        }
      })
      
      // Copy directories
      dirsToCopy.forEach(dir => {
        try {
          if (existsSync(dir)) {
            const destDir = resolve('dist', dir)
            cpSync(dir, destDir, { recursive: true })
            console.log(`Copied directory ${dir} to dist/${dir}`)
          }
        } catch (err) {
          console.error(`Error copying directory ${dir}:`, err)
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyStaticHtml()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  }
})

