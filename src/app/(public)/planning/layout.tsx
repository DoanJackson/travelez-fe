import PlanningChrome from "@/components/planning/PlanningChrome";

export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 pt-8 pb-16">
        <PlanningChrome />
        {children}
      </div>
    </div>
  );
}
