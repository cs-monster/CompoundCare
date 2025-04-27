import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ReactCompiler from 'babel-plugin-react-compiler'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    tailwindcss(),
    react({
      babel: {
        plugins: [ReactCompiler]
      }
    }), nodePolyfills(),
  ],
  // Add this new section at root level (won't affect existing plugins)
  define: {
    'process.env': {
      VITE_SUPABASE_URL: JSON.stringify(process.env.VITE_SUPABASE_URL),
      VITE_SUPABASE_ANON_KEY: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
    }
  }
})