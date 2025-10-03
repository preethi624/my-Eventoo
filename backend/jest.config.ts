// jest.config.ts
import { createDefaultPreset } from "ts-jest";

/** @type {import('jest').Config} */
const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
