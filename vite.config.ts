import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// base relativa: funciona em qualquer subcaminho (GitHub Pages).
export default defineConfig({ base: "./", plugins: [react()], server: { port: 5190 } });
