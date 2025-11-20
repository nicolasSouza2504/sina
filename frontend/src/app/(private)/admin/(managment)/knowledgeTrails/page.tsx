"use client";

import QuickActions from "@/components/admin/quickActions";

export default function KnowledgeTrailsById() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Knowledge Trails Management</h1>
        
        <div className="mb-8">
          <div>Hello From Knowledge Trail </div>
        </div>
        
        {/* Quick Actions Section */}
        <div className="mb-8">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
