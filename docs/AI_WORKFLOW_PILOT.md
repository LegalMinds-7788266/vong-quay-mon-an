# AI workflow pilot

This document records a non-production test of the repository publishing flow.

## Scope

- Start from the current `main` commit.
- Work only on the `ai/pilot-github-flow` branch.
- Add documentation only; do not change application behavior.
- Run the existing production build before and after the change.
- Push the branch and open a draft pull request.
- Do not merge the pull request.

## Safety boundaries

- No credentials, environment values, OTPs, or production data are included.
- No Supabase schema, data, or configuration is changed.
- No deployment is triggered by this pilot.
- The default branch remains unchanged until a human explicitly approves a merge.

## Validation

The pilot is successful when the branch contains only this documentation file,
`npm run build` succeeds, and a draft pull request targets `main`.
