window.onload = function () {
  displayReports();
};

document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const location = document.getElementById("location").value;

  const newReport = {
    title,
    description,
    location,
    date: new Date().toLocaleString(),
  };

  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  reports.push(newReport);
  localStorage.setItem("reports", JSON.stringify(reports));

  this.reset();
  displayReports();
});

function displayReports() {
  const reports = JSON.parse(localStorage.getItem("reports")) || [];
  const reportList = document.getElementById("reportList");
  reportList.innerHTML = "";

  if (reports.length === 0) {
    reportList.innerHTML = "<p style='text-align:center;'>No incidents reported yet.</p>";
    return;
  }

  reports.reverse().forEach((report) => {
    const div = document.createElement("div");
    div.className = "report-item";
    div.innerHTML = `
      <strong>${report.title}</strong>
      <p>${report.description}</p>
      <small>${report.location} • ${report.date}</small>
    `;
    reportList.appendChild(div);
  });
}
