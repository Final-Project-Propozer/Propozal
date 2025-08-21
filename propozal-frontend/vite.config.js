import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        bypass: (req, res, options) => {
          if (req.url.startsWith("/@")) {
            return req.url;
          }

          if (req.headers.accept?.includes("text/html")) {
            return req.url;
          }

          const pathname = req.url.split("?")[0];
          if (
            /\.(js|jsx|mjs|css|ico|png|jpg|jpeg|svg|gif|woff|woff2|eot|ttf|otf)$/.test(
              pathname
            )
          ) {
            return req.url;
          }
        },
      },
    },
  },
});
