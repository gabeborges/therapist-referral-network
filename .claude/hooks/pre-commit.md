Run the following checks before every commit. Block the commit if any step fails.

1. `pnpm lint` — ESLint must pass with zero errors
2. `pnpm typecheck` — TypeScript compilation must succeed with no errors
3. `pnpm test` — All tests must pass

Do not skip any step. Do not use `--no-verify` to bypass these checks.
