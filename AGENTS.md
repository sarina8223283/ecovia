# Project rules

- Serve catalog photos from a single optimized `public/images/products` collection shared by the UI and image sitemap; duplicate source copies increase repository and deployment size.
- Preserve existing contact addresses, browser storage keys, payment identifiers, and historical migration records during display-brand renames; changing those can interrupt customer flows.
- Keep inspected packaging photo references in a dedicated catalog manifest and display them separately from customer feedback; official imagery must not imply customer endorsement.
- Load non-home pages in separate lazy chunks so admin, invoices and other infrequent tools do not delay the storefront's first visit.
- Keep the chatbot in a separate lazy chunk so its message-rendering dependencies are not part of the initial storefront bundle.