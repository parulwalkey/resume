# Parul Walkey Portfolio Site

This is a static one-page portfolio site built from `resume_parul.docx`.

## Hosting Decision

Yes, this can be hosted on GitHub Pages or any free static host because it only uses:

- `index.html`
- `styles.css`
- local SVG assets in `assets/`

No backend, database, build step, paid Gamma account, or server runtime is required.

## Free Hosting Options

- GitHub Pages: best fit for a simple resume portfolio.
- Netlify: drag-and-drop or Git-based deploys.
- Vercel: Git-based deploys with a free hobby tier.
- Cloudflare Pages: fast static hosting with a free tier.

## GitHub Pages Setup

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, `.gitignore`, and the `assets/` folder to the repository root.
3. In GitHub, go to Settings > Pages.
4. Set Source to `Deploy from a branch`.
5. Select the `main` branch and `/root`.
6. Save. GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

## Local Preview

Open `index.html` directly in a browser.

The generated screenshot files are local QA artifacts and are ignored by `.gitignore`.
