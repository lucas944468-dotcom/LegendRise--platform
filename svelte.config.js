import adapter from "@sveltejs/adapter-netlify";

/** Netlify deployment (Functions + static output). Local `vite dev` unaffected. */
const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;
