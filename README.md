# CCAF 101

GitHub Pages site for Korean study notes on Claude Certified Architect - Foundations (CCAF).

## Structure

- `docs/`: markdown content served by MkDocs
- `mkdocs.yml`: site navigation and theme configuration
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

The production site is published at `https://bitboom.github.io/ccaf101/`.
