# Expense Tracker — Frontend

Static **HTML + CSS + JavaScript** UI for the [Python API](../python/) in the `python` folder.

## Features

- Add expenses (form)
- List with category and date filters
- Monthly report
- Delete expense
- Export CSV (link to API)
- API connection status indicator

## Requirements

1. **Backend running** on `http://127.0.0.1:8000`:

   ```bash
   cd ../python
   source .venv/bin/activate
   ./scripts/run.sh
   ```

2. **Serve this folder over HTTP** (do not open `index.html` as `file://` — browsers block API calls).

   ```bash
   cd /Users/david/Desktop/portfolio/html2
   python3 -m http.server 5500
   ```

3. Open in the browser: **http://127.0.0.1:5500**

## Project structure

```
html2/
├── index.html
├── css/styles.css
├── js/
│   ├── config.js   # API URL
│   ├── api.js      # fetch helpers
│   └── app.js      # UI logic
└── README.md
```

## Change API URL

Edit `js/config.js`:

```js
const API_BASE_URL = "http://127.0.0.1:8000";
```

## Publish to GitHub

This folder can be its own repository or live next to `python` in a monorepo.

```bash
cd html2
git init
git add .
git commit -m "Add expense tracker frontend"
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker-frontend.git
git push -u origin main
```

## License

MIT
