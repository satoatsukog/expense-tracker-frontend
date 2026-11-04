# Expense Tracker: Frontend

Browser interface for the [Expense Tracker API](https://github.com/satoatsukog/expense-tracker). Plain HTML, CSS and JavaScript, no build step and no framework.

<!-- After deploying, add here: **Live demo:** https://your-frontend-url -->

## Features

- Add an expense with a form
- List expenses with category and date filters
- Monthly report
- Delete an expense
- Export to CSV
- Indicator that shows whether the API is reachable

## Tech stack

HTML5, CSS3, JavaScript (`fetch` API)

## Run locally

1. Start the backend from the [expense-tracker](https://github.com/satoatsukog/expense-tracker) repository. It listens on `http://127.0.0.1:8000`.
2. Serve this folder over HTTP. Opening `index.html` as `file://` does not work, because the browser blocks the API calls.

```bash
git clone https://github.com/satoatsukog/expense-tracker-frontend.git
cd expense-tracker-frontend
python3 -m http.server 5500
```

3. Open http://127.0.0.1:5500

## Configuration

The API address is set in `js/config.js`:

```js
const API_BASE_URL = "http://127.0.0.1:8000";
```

Change it if the backend runs somewhere else.

## Project structure

```
expense-tracker-frontend/
├── index.html
├── css/styles.css
└── js/
    ├── config.js   # API URL
    ├── api.js      # fetch helpers
    └── app.js      # UI logic
```

## License

MIT
