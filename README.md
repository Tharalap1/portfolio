# Pranay Tharala — Portfolio Site

A single-page static portfolio for **Pranay Tharala, Senior AI/ML Engineer**.
Vanilla HTML/CSS/JS only — no build step, no dependencies.

## Files

| File | Purpose |
|---|---|
| `index.html` | Full page: hero, stats, domains, workflow, skills, projects, experience, education, FAQ, contact |
| `styles.css` | Blue glass-card theme, responsive |
| `script.js` | Animated stat counters, mobile nav toggle, footer year |
| `assets/profile.jpg` | Headshot (used in hero) |
| `assets/Pranay_Tharala_Resume.txt` | Downloadable plain-text resume |

## Publish on GitHub Pages

```bash
cd ~/workspace/pranay-portfolio-site
git init
git add .
git commit -m "Add portfolio site"
gh repo create <username>/portfolio --public --source=. --push
# then: repo Settings → Pages → Deploy from branch → main → / (root)
```

The site lives at `https://<username>.github.io/portfolio/`. All asset paths are
relative, so the `/portfolio/` subpath works out of the box.

To add it to the resume header, use the final URL in place of `<your GitHub Pages URL>`.
