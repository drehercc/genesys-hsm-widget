import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts:true
  },
  // optimizeDeps:{
  //   include : ['purecloud-platform-client-v2']
  // },
  resolve : {
    mainFields: ['module','browser','main']
  }
})
