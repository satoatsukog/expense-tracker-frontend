const form = document.getElementById("expenseForm");
const formMessage = document.getElementById("formMessage");
const expensesBody = document.getElementById("expensesBody");
const apiStatus = document.getElementById("apiStatus");
const reportMonth = document.getElementById("reportMonth");
const reportTotal = document.getElementById("reportTotal");
const reportCategories = document.getElementById("reportCategories");
const filterCategory = document.getElementById("filterCategory");
const filterFrom = document.getElementById("filterFrom");
const filterTo = document.getElementById("filterTo");
const exportCsvLink = document.getElementById("exportCsvLink");

document.getElementById("apiUrlLabel").textContent = API_BASE_URL;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function currentYearMonth() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function setMessage(text, type = "") {
  formMessage.textContent = text;
  formMessage.className = `message ${type}`.trim();
}

function formatMoney(value) {
  const num = Number(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
}

function getFilterParams() {
  return {
    category: filterCategory.value || undefined,
    date_from: filterFrom.value || undefined,
    date_to: filterTo.value || undefined,
  };
}

function updateExportLink() {
  exportCsvLink.href = exportCsvUrl(getFilterParams());
}

async function refreshApiStatus() {
  try {
    await checkHealth();
    apiStatus.className = "api-status online";
    apiStatus.querySelector("span:last-child").textContent = "API connected";
    return true;
  } catch {
    apiStatus.className = "api-status offline";
    apiStatus.querySelector("span:last-child").textContent = "API offline — start backend";
    return false;
  }
}

async function loadExpenses() {
  expensesBody.innerHTML = `<tr><td colspan="5" class="empty">Loading…</td></tr>`;
  updateExportLink();

  try {
    const items = await listExpenses(getFilterParams());
    if (!items.length) {
      expensesBody.innerHTML = `<tr><td colspan="5" class="empty">No expenses yet</td></tr>`;
      return;
    }

    expensesBody.innerHTML = items
      .map(
        (row) => `
      <tr>
        <td>${row.spent_on}</td>
        <td><span class="category-badge">${CATEGORY_LABELS[row.category] || row.category}</span></td>
        <td class="amount">${formatMoney(row.amount)}</td>
        <td>${escapeHtml(row.description || "—")}</td>
        <td><button type="button" class="btn danger" data-id="${row.id}">Delete</button></td>
      </tr>`
      )
      .join("");

    expensesBody.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => handleDelete(btn.dataset.id));
    });
  } catch (err) {
    expensesBody.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(err.message)}</td></tr>`;
  }
}

async function loadReport() {
  const value = reportMonth.value;
  if (!value) return;

  const [year, month] = value.split("-").map(Number);
  reportTotal.textContent = "Loading…";
  reportCategories.innerHTML = "";

  try {
    const data = await monthlyReport(year, month);
    reportTotal.textContent = formatMoney(data.total);
    reportCategories.innerHTML = data.by_category.length
      ? data.by_category
          .map(
            (row) =>
              `<li><span>${CATEGORY_LABELS[row.category] || row.category}</span><span>${formatMoney(row.total)} (${row.count})</span></li>`
          )
          .join("")
      : "<li><span>No data for this month</span></li>";
  } catch (err) {
    reportTotal.textContent = "—";
    reportCategories.innerHTML = `<li><span>${escapeHtml(err.message)}</span></li>`;
  }
}

async function handleDelete(id) {
  if (!confirm("Delete this expense?")) return;

  try {
    await deleteExpense(id);
    setMessage("Expense deleted", "ok");
    await loadExpenses();
    await loadReport();
  } catch (err) {
    setMessage(err.message, "err");
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);

  const payload = {
    amount: String(data.get("amount")),
    category: data.get("category"),
    spent_on: data.get("spent_on"),
    description: data.get("description") || null,
  };

  try {
    await createExpense(payload);
    setMessage("Expense saved", "ok");
    form.reset();
    form.spent_on.value = todayIso();
    await loadExpenses();
    await loadReport();
  } catch (err) {
    setMessage(err.message, "err");
  }
});

document.getElementById("applyFiltersBtn").addEventListener("click", loadExpenses);
document.getElementById("loadReportBtn").addEventListener("click", loadReport);

async function init() {
  const { year, month } = currentYearMonth();
  reportMonth.value = `${year}-${String(month).padStart(2, "0")}`;
  form.spent_on.value = todayIso();

  const online = await refreshApiStatus();
  if (online) {
    await loadExpenses();
    await loadReport();
  } else {
    expensesBody.innerHTML =
      `<tr><td colspan="5" class="empty">Start the API: cd python && ./scripts/run.sh</td></tr>`;
  }
}

init();
