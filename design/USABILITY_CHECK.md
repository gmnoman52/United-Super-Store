# Usability and mobile check — 9 November 2026

Scope: the Expo customer app and the separate React admin website. The root design reference also uses the optimized logo, favicon, current copyright year and requested credit.

## Changes

- Responsive customer menu and collapsible admin menu, with working destinations and clickable home logos.
- Customer layouts wrap long product names. Admin tables become labelled stacked rows on narrow screens; controls, filters and pagination wrap without horizontal scrolling.
- Five customer routes and five admin sections have appropriate titles and descriptions. Customer web exports include metadata in the initial HTML, following [Expo's static rendering guidance](https://docs.expo.dev/router/web/static-rendering/).
- Branded favicons and custom 404 screens, including standalone 404 documents for static hosting.
- Shared footer links point to implemented destinations. Copyright uses the current year in Asia/Karachi. Every footer ends with `Powerd by GEN ALPHA DEVELOPERS`.
- Public phone and optional contact email come from store settings and use `tel:` and `mailto:` links. Blank contact details are omitted. The account email is also clickable. No contact information was invented.
- Success and error feedback covers authentication, checkout/order confirmation and admin forms. Loading, disabled, empty and retry states remain functional. Search placeholder text was removed while accessible field names remain.
- Display logos reduced from 610,056 bytes to 6,282 bytes. Original artwork is retained. New product photo uploads are resized to at most 1200px and compressed when this improves size. Unavailable product photos show a bag fallback.
- Web icon rendering waits for hydration, preventing an icon-font loading race. Firebase web authentication initializes when sign-in starts, allowing static page generation.
- Applied the optional public contact-email migration. No products, categories, orders or customer accounts were created for this work.

## Verification

- Customer TypeScript and lint: passed.
- Admin production build and lint: passed.
- Expo production web export and Android bundle export: passed.
- 48 responsive route checks: Home, Browse, Cart, Orders, Account and missing routes; admin Dashboard, Products, Categories, Orders, Settings and missing routes; each at 320, 375, 768 and 1440px.
- Three further layout checks covered the product editor, direct admin missing-path screen and anonymous admin login: 51 total. Document width matched the viewport throughout, with no page errors.
- Tested menu open/close/navigation, home-logo navigation, add-to-cart feedback and cart navigation, login validation, signup/reset mode buttons, reset error and success feedback, catalogue failure/retry, admin settings error and success feedback, and rejected passcode feedback.
- Verified footer route destinations, clickable phone/email, current year, requested credit, descriptions, titles and favicon image responses. Six exported customer HTML documents each contain exactly one title and one description.
- Compression check: a 2400×1600 PNG became a 1200×800 WebP, reducing 79,786 bytes to 2,250 bytes. Unsupported input was rejected.
- Visually inspected 375px customer and admin screenshots, including long product names.

Browser fixtures and simulated responses stayed inside isolated test browser contexts. Requests that would write data were intercepted; real store inventory and orders were untouched.

## Remaining verification and hosting

No physical Android/iOS device session, APK installation, full Google user sign-in or production deployment was performed in this usability pass. Those are separate from the successful bundle exports. The hosting instructions in each app README describe static route and 404 handling.

The Supabase security check reported no new schema/RLS issue. Its existing warning remains: leaked-password protection is disabled. [Supabase password-protection guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
