import { defineConfig } from "vite"
import monkey from "vite-plugin-monkey"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        icon: "https://vitejs.dev/logo.svg",
        namespace: "https://github.com/mikelxk/remove_redirect",
        match: ["*://*.zhihu.com/*"],
        author: "mikelxk",
        description: "remove redirects in zhihu.com",
        grant: "none",
        license: "MIT",
      },
    }),
  ],
})
