import adapter from "@sveltejs/adapter-node";

/** Self-hosted Node output for local device now, VPS later (ADR-1). */
const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;
