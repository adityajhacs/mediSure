import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacyFooter from "@/components/pharmacy/PharmacyFooter";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PharmacyNavbar />

      <main className="flex-1">
        {children}
      </main>

      <PharmacyFooter />
    </div>
  );
}