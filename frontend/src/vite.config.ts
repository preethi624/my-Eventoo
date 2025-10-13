/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // Replace these with Docker build args injected via process.env
    'import.meta.env.VITE_REACT_APP_API_BASE_URL': JSON.stringify(process.env.FRONTEND_VITE_REACT_APP_API_BASE_URL),
    'import.meta.env.VITE_REACT_APP_SOCKET_URL': JSON.stringify(process.env.FRONTEND_VITE_REACT_APP_SOCKET_URL),
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/vitest.setup.ts", 
  },
});
