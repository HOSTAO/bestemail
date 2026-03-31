# Second Build Notes

Date: 2026-03-11

## What changed

Performed a second low-risk cleanup pass on public-facing marketing pages to reduce misleading claims and bring copy closer to the current early-stage product reality.

### Updated pages
- `src/app/about/page.tsx`
  - Replaced invented scale, headcount, funding, and milestone claims with early-stage positioning.
  - Simplified the team section to avoid listing likely fictional executives.
  - Softened CTA language.

- `src/app/customers/page.tsx`
  - Reworked the page from fake customer success/social-proof into clearly labeled illustrative workflow examples.
  - Removed invented revenue/ROI/customer-retention style stats.

- `src/app/integrations/page.tsx`
  - Reframed integrations as roadmap ideas / commonly requested targets rather than live native integrations.
  - Removed implied real-time/live availability language.

- `src/app/solutions/page.tsx`
  - Rewrote industry solution claims to be fit examples instead of proven scaled outcomes.
  - Replaced fake case studies with illustrative examples.

- `src/app/press/page.tsx`
  - Removed invented funding/customers/certification/scale press claims.
  - Reworked the page into a simple media contact + current-status resource page.

- `src/app/docs/page.tsx`
  - Adjusted docs copy to better distinguish current functionality from planned/partial areas.
  - Softened advanced claims around automation/integrations/analytics.

- `src/components/StandardFooter.tsx`
  - Removed misleading trust/scale/compliance badges and enterprise positioning.
  - Switched internal navigation links to `next/link`.

## Lint-oriented cleanup
- Replaced several internal `<a href="/...">` links in touched files with `Link` from `next/link`.
- Used escaped text where needed in JSX-visible strings.

## Notes
- I intentionally kept this pass practical and low-risk.
- I did not try to fully rewrite other pages like security, privacy, careers, pricing, or older unused `page-old` files in this pass.
- Those may still contain over-claimed or placeholder marketing language and could use a later honesty pass.
