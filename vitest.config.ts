import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 15000,
    sequence: { concurrent: false },
  },
  resolve: {
    alias: {
      "@/app/generated/prisma": path.resolve(__dirname, "app/generated/prisma"),
      "@": path.resolve(__dirname, "."),
    },
  },
});
