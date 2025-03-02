import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom rules here to disable them
  {
    rules: {
      'react/display-name': 'off', // Disables the "Component definition is missing display name" rule
      '@typescript-eslint/no-unused-vars': 'off', // Disables the "Unused variables" rule
      '@typescript-eslint/no-explicit-any': 'off', // Disables the "Unexpected any" rule
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off', // Disables the "Optional chain expressions can return undefined by design" rule
      'no-var': 'off' // Disables the "Unexpected var, use let or const instead" rule
    }
  }
];

export default eslintConfig;
