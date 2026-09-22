# SZN4.DESIGN — Combined Vercel Site

This package combines:

- `/` — animated welcome page
- `/about-me` — animated storytelling About Me page
- About Me CTA on the welcome page now points to `/about-me/`

## Important routing note

The **View Projects** links still point to:

https://szn4.design/ui-ux-projects

If `szn4.design` is later moved fully to Vercel while project pages remain hosted in
Adobe Portfolio, you will need a Vercel rewrite/proxy for the Adobe-hosted project
paths. The current package intentionally does not guess your Adobe `myportfolio.com`
origin.

## Deploy to Vercel from GitHub

1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In Vercel, choose **Add New → Project**.
4. Import the GitHub repository.
5. Framework preset: **Other**.
6. Leave build command empty.
7. Leave output directory empty.
8. Deploy.

Vercel should serve:
- `/` from root `index.html`
- `/about-me` from `about-me/index.html`

## Contact form

The About page sends messages via FormSubmit to:

sabrina@szn4.design

FormSubmit may send a one-time activation email to that address after the first test.
Confirm it before relying on the form publicly.


## About-page asset-path fix

This version fixes the Vercel `/about-me` issue by:
- using `/about-me/styles.css`
- using `/about-me/script.js`
- using `/about-me/assets/...` for all About images
- enabling trailing-slash routing in `vercel.json`

This prevents the About page from accidentally loading the welcome page's root CSS
and prevents image requests from incorrectly going to `/assets/...`.
