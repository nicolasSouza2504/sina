import QuickActions from "@/components/admin/quickActions";

export default function TeachersManagmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Teachers Management</h1>
        
        {/* Quick Actions Section */}
        <div className="mb-8">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
