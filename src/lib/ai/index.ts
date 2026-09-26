// AI service boundary (ADR-0005, PRD §11).
// One module per service. Phase 2 ships CONTRACTS ONLY (prompt versions +
// zod schemas + stub entry points). Phase 6 implements the lifecycle.
export * as assessor from "./assessor";
export * as roadmap from "./roadmap";
export * as tutor from "./tutor";
export * as simulation from "./simulation";
export * as evaluator from "./evaluator";
export * as recommender from "./recommender";
export * as venture from "./venture";
