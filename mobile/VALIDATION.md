# Validation record

## Runtime checks

- Customer app: live email/password login against Supabase, session restoration after reload, logout, signup validation and five customer-only tabs passed. A temporary confirmed validation user was used; it and its sessions were removed afterward.
- Separate admin website: live login and database-backed role gate, dashboard counts, product form validation, categories/orders/settings pages, responsive layout and logout passed.
- A valid customer carrying spoofed admin user metadata was denied access to the admin panel.
- Real product photo upload using the approved logo, public retrieval, and removal passed. The validation image was removed.
- No signup, confirmation, reset or other test emails were sent. Delivery to a real inbox and deployment redirect configuration still need owner setup.

## Database checks

supabase/security-check.sql runs inside a transaction and rolls back every fixture. Assertions cover customer write denial, self-admin-grant denial, user-metadata spoofing, server order totals, inventory reservation, idempotent retries, cross-customer order isolation, overselling rejection, owner access, status transitions, cancellation restoring stock exactly once, stale inventory update rejection, configuration requirements, changed/tampered price rejection, and a complete pickup order lifecycle.

After cleanup: zero products, categories, orders, uploaded product images, validation accounts and permanent admin memberships. The owner was subsequently activated with the user-provided passcode. Actual passcode login, admin membership and the separate admin dashboard were verified; the local plaintext setup file was then cleared. Store ordering remains disabled with no invented fee or address.

Supabase security advisors, TypeScript, lint, admin production build and Android export checks are recorded by the development run. The mobile UI was exercised through React Native Web, not on a physical Android device. No APK or production deployment has been created.
