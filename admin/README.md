# United Super Store admin website

This is a separate React/Vite website. No admin screens or links are included in the customer Android app.

## Run

```powershell
npm ci
# Local .env is already configured. For another installation, copy .env.example to .env and fill in the project URL and publishable key.
npm run dev -- --host 127.0.0.1 --port 5173
```

Open http://127.0.0.1:5173. For a production build, run `npm run build`; deploy the `dist` directory to your chosen HTTPS host with the two VITE_SUPABASE environment variables set during the build. No service-role key belongs in this website.

## Owner setup

The admin website asks only for a passcode. There is no email field, public admin signup or email reset flow. Customer authentication in the mobile app is unchanged.

1. Enter a passcode of at least 12 characters into the private local file C:/Users/faisa/.codex/secrets/united-super-store-owner-passcode.txt. It is outside the repository and dev-server roots.
2. Run node ../scripts/hash-owner-passcode.mjs from this directory to prepare a bcrypt hash locally. The helper never prints the plaintext.
3. An authorised project administrator provisions the account with ../supabase/provision-passcode-owner.sql using that hash. This is deliberately not a public API. Once provisioned, clear the local plaintext file.
4. Unlock the website using the passcode. Supabase Auth verifies it, hashes it server-side and applies its authentication rate limits. Database and image writes still require private owner membership.

The internal identifier owner@united-super-store.invalid is a technical username, not a mailbox or secret. No owner email or confirmation email is required. The passcode must never be embedded in browser code, VITE_ variables, Git or chat. The owner account has been activated with the user-provided passcode; no default passcode is used. Live passcode unlock and database owner access were verified. The temporary local plaintext file was cleared afterward. Passcode changes go through the project administrator; session revocation and existing admin access must be handled during rotation.

Customer confirmation and password-reset email callback setup remains described in ../mobile/README.md.

## Features

- Actual dashboard counts, with no fabricated metrics.
- Product search, visibility filter and pagination; create, edit and delete products; available stock and exact rupee/paisa prices.
- Product photo upload to a public product-images bucket, restricted to owner writes, JPG/PNG/WebP up to 5 MB; photos are resized to at most 1200px and compressed before upload.
- Category creation, editing, visibility and deletion.
- Order filters, paging, customer details, immutable item/price snapshots and cash payment information.
- Database-enforced status transitions, inventory reservation and cancellation stock restoration.
- Store name, address, phone, optional public contact email, fulfilment options, delivery fee, minimum order and accepting-orders switch. Saved contact details become clickable footer links in both apps.
- Optimistic concurrency prevents stale product forms from overwriting newer inventory updates.

Store ordering starts disabled. No product, category, price, order, customer or delivery fee was seeded. The store settings row contains only its known name and unconfigured/disabled settings.

## Validation

`npm run build` and `npm run lint` validate this website. See ../mobile/VALIDATION.md for cross-app runtime and backend checks. Backend migrations, in order: catalogue.sql, auth_admin_orders.sql, order_hardening.sql, admin_privileges.sql, product_concurrency.sql, checkout_total.sql, store_contact_email.sql. `security-check.sql` verifies permissions, prices, inventory and order invariants in a rolled-back transaction.

On production hosting, keep the supplied `404.html` as the unknown-path fallback. The admin pages use hash routes under `/`.
