# Security Report v2

## Metadata
- Repository: `<repo>`
- Branch/Commit: `<branch>@<sha>`
- Date (UTC): `<yyyy-mm-ddThh:mm:ssZ>`
- Reviewer: `<agent/human>`
- Tooling: `<node version>`, `<npm version>`, `<audit command>`, `<secret scan method>`

## Coverage Summary
- Scanned areas:
  - `<paths/components reviewed>`
  - `<dependency manifests + lockfiles>`
  - `<auth/session/token handling>`
  - `<storage/persistence>`
  - `<unsafe pattern checks>`
- Not assessed:
  - `<area> - <reason>`
- Confidence: `<High|Medium|Low>`
- Shipped-surface assumption:
  - Web shipped: `<Yes|No|Unknown>`
  - Mobile shipped: `<Yes|No|Unknown>`
  - Backend in-scope: `<Yes|No|Unknown>`

## Severity Summary
- Critical: `<count>`
- High: `<count>`
- Medium: `<count>`
- Low: `<count>`
- Informational: `<count>`

## Critical
- No Critical findings.

## High
- No High findings.

## Medium
- `<ID>: <Title>`
  - Status: `<New|Known|Regressed|Unchanged>`
  - Area: `<Auth|Session|Secrets|Dependency|Storage|Input Validation|Transport|Config|Other>`
  - Ownership: `<Frontend|Backend|DevOps|Security|Product>`
  - Exact file path(s): `<path1>, <path2>`
  - Evidence:
    - `<short quote/pattern/command output>`
  - Exploit preconditions:
    - `<what must be true>`
  - Impact:
    - `<attacker gain / user harm>`
  - Likelihood: `<1-5>`
  - Impact score: `<1-5>`
  - Risk score: `<Likelihood x Impact>`
  - Why it matters:
    - `<concise explanation>`
  - Recommended fix:
    - `<specific actions>`
  - Verification:
    - `<how to verify fix>`
  - References:
    - `<CWE/advisory/docs>`

## Low
- No Low findings.

## Informational
- `<ID>: <Title>`
  - Evidence:
    - `<supporting note>`
  - Why it matters:
    - `<context>`
  - Recommendation:
    - `<optional improvement>`

## Dependency Risk Appendix
- Audit command: `<exact command>`
- Result summary: `<counts by severity>`
- Vulnerable package/version pairs:
  - `<pkg>@<version> -> <advisory id/severity/fix>`
- Outdated but non-vulnerable (optional):
  - `<pkg current -> latest>`

## Secrets Exposure Appendix
- Scan scope: `<tracked only / includes untracked>`
- Potential secrets found:
  - `<file, key type, classification: Public config | Secret | Needs review>`
- Notes:
  - `EXPO_PUBLIC_*` values are public-by-design unless misuse is proven.

## Auth/Session Appendix
- Session storage model by platform:
  - Web: `<localStorage/cookie/in-memory/etc>`
  - Native: `<SecureStore/AsyncStorage/etc>`
- Token lifecycle checks:
  - `<refresh, logout invalidation, storage cleanup, route guards>`
- Residual risks:
  - `<bullets>`

## Top 5 Next Actions (Prioritized)
1. `<action>` - Owner: `<team>` - ETA: `<date>` - Risk reduced: `<IDs>`
2. `<action>` - Owner: `<team>` - ETA: `<date>`
3. `<action>` - Owner: `<team>` - ETA: `<date>`
4. `<action>` - Owner: `<team>` - ETA: `<date>`
5. `<action>` - Owner: `<team>` - ETA: `<date>`

## Gate Recommendation
- Release gate: `<Pass|Pass with exceptions|Fail>`
- Rationale: `<1-3 lines>`
- Required before release:
  - `<must-fix IDs>`
