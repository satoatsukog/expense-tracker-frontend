async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      if (body.detail) {
        detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
      }
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function checkHealth() {
  return apiRequest("/health");
}

function listExpenses(params = {}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.date_from) search.set("date_from", params.date_from);
  if (params.date_to) search.set("date_to", params.date_to);
  const query = search.toString();
  return apiRequest(`/expenses${query ? `?${query}` : ""}`);
}

function createExpense(payload) {
  return apiRequest("/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function deleteExpense(id) {
  return apiRequest(`/expenses/${id}`, { method: "DELETE" });
}

function monthlyReport(year, month) {
  return apiRequest(`/expenses/report/monthly?year=${year}&month=${month}`);
}

function exportCsvUrl(params = {}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.date_from) search.set("date_from", params.date_from);
  if (params.date_to) search.set("date_to", params.date_to);
  const query = search.toString();
  return `${API_BASE_URL}/expenses/export.csv${query ? `?${query}` : ""}`;
}
