# Orbit Search

Orbit is a small, original search website with a curated index of useful
websites. It searches titles, descriptions, and keywords locally; it does
**not** crawl or search the entire web. The “Search the web” link sends your
query to DuckDuckGo when you choose to use it. Saved pages stay in your
browser's local storage when available.

Run from the repository root:

```bash
python -m http.server 8001 --directory search-website
```

Open the server in a browser. No installation or API keys are needed. The
page uses a web font when available and falls back to system fonts.

To test the search logic (requires Node.js):

```bash
node --test search-website/engine.test.js
```
