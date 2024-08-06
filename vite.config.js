import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { base } from "./config.json";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
});
