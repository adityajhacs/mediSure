// Simple demo data until backend is ready
const shipments = [
  { title: "Incoming Shipments", count: 5, color: "#00A878" },
  { title: "Received", count: 12, color: "#008F68" },
  { title: "In Transit", count: 3, color: "#F97316" },
  { title: "Temperature Alerts", count: 1, color: "#101828" }
];

const container = document.getElementById("dashboardCards");

shipments.forEach(item => {
  const card = document.createElement("div");
  card.className =
    "rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md";
  card.innerHTML = `
    <div class="rounded-lg bg-[#ECFDF5] p-2 text-[${item.color}] mb-3">📦</div>
    <h3 class="text-lg font-bold text-[#101828]">${item.title}</h3>
    <p class="text-3xl font-bold text-[${item.color}] mt-2">${item.count}</p>
  `;
  container.appendChild(card);
});
window.location.href = "details.html";
