import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

const stats = [
  {
    title: "Incoming Medicines",
    value: "12",
    description: "Awaiting receipt",
    icon: Truck,
  },
  {
    title: "Available Medicines",
    value: "148",
    description: "Currently in pharmacy",
    icon: Package,
  },
  {
    title: "Verified Batches",
    value: "136",
    description: "Successfully verified",
    icon: ShieldCheck,
  },
  {
    title: "Alerts",
    value: "4",
    description: "Require attention",
    icon: AlertTriangle,
  },
];

const recentMedicines = [
  {
    batchId: "MED-001",
    medicine: "Paracetamol 500mg",
    batch: "PCM2026A01",
    status: "AVAILABLE",
  },
  {
    batchId: "MED-002",
    medicine: "Azithromycin 500mg",
    batch: "AZM2026B04",
    status: "AVAILABLE",
  },
  {
    batchId: "MED-003",
    medicine: "Amoxicillin 250mg",
    batch: "AMX2026C02",
    status: "IN TRANSIT",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* Header */}
      <section className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#008F68]">
                <ShieldCheck size={15} />
                Pharmacy Portal
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
                Pharmacy Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#475467]">
                Manage medicines, batches and supply-chain verification.
              </p>
            </div>

            <Link
              href="/incoming"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#008F68]"
            >
              View Incoming Medicines
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
                  <Icon size={21} />
                </div>

                <p className="mt-5 text-sm font-medium text-[#667085]">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold text-[#101828]">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-[#667085]">
                  {stat.description}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          
          <QuickAction
            href="/incoming"
            icon={Truck}
            title="Incoming Medicines"
            description="Review medicines sent by distributors."
          />

          <QuickAction
            href="/inventory"
            icon={Package}
            title="View Inventory"
            description="Manage medicines currently available."
          />

          <QuickAction
            href="/verification"
            icon={ShieldCheck}
            title="Verify Medicine"
            description="Check medicine authenticity and traceability."
          />

        </div>
      </section>

      {/* Recent Medicines */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
          
          <div className="flex flex-col gap-3 border-b border-[#E4E7EC] p-5 sm:flex-row sm:items-center sm:justify-between">
            
            <div>
              <h2 className="text-xl font-bold text-[#101828]">
                Recent Medicines
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Recently received and tracked medicine batches.
              </p>
            </div>

            <Link
              href="/inventory"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#00A878] hover:text-[#008F68]"
            >
              View Inventory
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Batch ID
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Medicine
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Batch
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold text-[#667085]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentMedicines.map((medicine) => (
                  <tr
                    key={medicine.batchId}
                    className="border-t border-[#E4E7EC]"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#101828]">
                      {medicine.batchId}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#475467]">
                      {medicine.medicine}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#667085]">
                      {medicine.batch}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={medicine.status} />
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href="/batch"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#00A878] hover:text-[#008F68]"
                      >
                        View Details
                        <ArrowRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </section>
    </main>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00A878] hover:bg-[#ECFDF5] hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#00A878]">
        <Icon size={21} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-bold text-[#101828]">
          {title}
        </h3>

        <ArrowRight
          size={18}
          className="text-[#667085] transition group-hover:translate-x-1 group-hover:text-[#00A878]"
        />
      </div>

      <p className="mt-1 text-sm leading-6 text-[#667085]">
        {description}
      </p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isAvailable = status === "AVAILABLE";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isAvailable
          ? "bg-[#ECFDF5] text-[#008F68]"
          : "bg-[#FFF7ED] text-[#F97316]"
      }`}
    >
      {status}
    </span>
  );
}