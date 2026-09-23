// Demo shipment data
const shipment = {
  id: "BATCH-2026-09",
  medicine: "PainRelief 250mg",
  status: "IN TRANSIT",
  temperature: [6.5, 7.2, 8.4, 7.8, 9.1] // sample readings
};

const container = document.getElementById("shipmentInfo");

// Show shipment details
container.innerHTML = `
  <p class="text-sm text-[#667085]">Batch ID: <span class="font-semibold text-[#101828]">${shipment.id}</span></p>
  <p class="text-sm text-[#667085]">Medicine: <span class="font-semibold text-[#101828]">${shipment.medicine}</span></p>
  <p class="text-sm text-[#667085]">Status: <span class="font-semibold text-[#008F68]">${shipment.status}</span></p>
  <h3 class="text-lg font-bold text-[#101828] mt-4">Temperature Readings (°C)</h3>
  <div class="grid grid-cols-5 gap-3 mt-2">
    ${shipment.temperature.map(temp => `
      <div class="rounded-lg border border-[#E4E7EC] p-3 text-center ${temp > 8 ? 'bg-[#FFF7ED] text-[#F97316]' : 'bg-[#ECFDF5] text-[#00A878]'}">
        ${temp}
      </div>
    `).join('')}
  </div>
`;

// Transfer button click
document.getElementById("transferBtn").addEventListener("click", () => {
  alert("Shipment transferred to pharmacy successfully!");
});
