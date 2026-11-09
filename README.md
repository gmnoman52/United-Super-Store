# United Super Store

Native Android implementation: [mobile/README.md](mobile/README.md). The files at the root remain the approved browser-based design reference.

Separate owner administration website: [admin/README.md](admin/README.md). Customer authentication and checkout are in the mobile app; administration is only in the separate website.

Android-first UI/UX preview for Ahmad's neighbourhood super store. Includes delivery/pickup selection, home, catalogue search, cart, orders, and guest account screens.

Open index.html directly, or serve this directory with `python -m http.server 4173` and visit http://localhost:4173.

This is a browser-based design prototype, not an Android APK. Supabase, sign-in, products, payments and order submission are not connected. No dummy products, prices, categories, offers or orders are included. Mode selection is held only for the current page session.

Approved identity: assets/brand/united-super-store-logo.png. Palette: design/colors.json; matching web tokens: design/tokens.css. Screens use a 4px spacing grid, 44px minimum touch targets, visible keyboard focus, and reduced-motion support.

Design guidance: UI/UX Pro Max, Hallmark and Unslop. Unslop by Damir Sokolovsky, https://github.com/heydamir/unslop, CC BY 4.0.
