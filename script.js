
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  document.getElementById("welcomeMessage").innerText =
    `👋 Welcome! Today is ${now.toLocaleDateString()} and the time is ${now.toLocaleTimeString()}`;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  ["title", "description", "location"].forEach(id => {
    const val = localStorage.getItem(`draft_${id}`);
    if (val) document.getElementById(id).value = val;

    document.getElementById(id).addEventListener("input", e => {
      localStorage.setItem(`draft_${id}`, e.target.value);
    });
  });

  updateReportList();
});

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

document.getElementById("reportForm").addEventListener("submit", e => {
  e.preventDefault();

  const report = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
    date: new Date().toLocaleString(),
  };

  const reports = JSON.parse(localStorage.getItem("reports") || "[]");
  reports.push(report);
  localStorage.setItem("reports", JSON.stringify(reports));

  ["title", "description", "location"].forEach(id => {
    document.getElementById(id).value = "";
    localStorage.removeItem(`draft_${id}`);
  });

  updateReportList();
});

document.getElementById("searchInput").addEventListener("input", updateReportList);
document.getElementById("sortOrder").addEventListener("change", updateReportList);

document.getElementById("clearReports").addEventListener("click", () => {
  if (confirm("Delete all reports?")) {
    localStorage.removeItem("reports");
    updateReportList();
  }
});

document.getElementById("exportReports").addEventListener("click", () => {
  const data = localStorage.getItem("reports");
  if (!data) return alert("No reports to export.");
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "neighborhood_reports.json";
  a.click();
  URL.revokeObjectURL(url);
});

function updateReportList() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const order = document.getElementById("sortOrder").value;
  const reports = JSON.parse(localStorage.getItem("reports") || "[]");

  const filtered = reports.filter(r =>
    r.title.toLowerCase().includes(query) ||
    r.description.toLowerCase().includes(query) ||
    r.location.toLowerCase().includes(query)
  );

  const sorted = order === "oldest" ? filtered : filtered.reverse();

  const container = document.getElementById("reportList");
  container.innerHTML = "";

  if (sorted.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>No reports found.</p>";
    return;
  }

  sorted.forEach(report => {
    const div = document.createElement("div");
    div.className = "report-item";
    div.innerHTML = `
      <strong>${report.title}</strong>
      <p>${report.description}</p>
      <small>${report.location} • ${report.date}</small>
    `;
    container.appendChild(div);
  });
}
