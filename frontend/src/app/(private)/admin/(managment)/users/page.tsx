import QuickActions from "@/components/admin/quickActions";

export default function UsersManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Users Management</h1>
        
        {/* Quick Actions Section */}
        <div className="mb-8">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
