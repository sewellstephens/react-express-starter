import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_API': JSON.stringify(env.REACT_APP_API),
      'process.env.REACT_APP_STARTUP_YEARLY': JSON.stringify(env.REACT_APP_STARTUP_YEARLY),
      'process.env.REACT_APP_STARTUP_MONTHLY': JSON.stringify(env.REACT_APP_STARTUP_MONTHLY),
      'process.env.REACT_APP_PRO_MONTHLY': JSON.stringify(env.REACT_APP_PRO_MONTHLY),
      'process.env.REACT_APP_PRO_YEARLY': JSON.stringify(env.REACT_APP_PRO_YEARLY),
      'process.env.REACT_APP_PUBLIC_POSTHOG_KEY': JSON.stringify(env.REACT_APP_PUBLIC_POSTHOG_KEY)
    },
    plugins: [react()],
  }
})

