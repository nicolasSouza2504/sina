"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Admin Courses Management Page
 * Redirects to the main courses page where all course management functionality is available
 */
export default function AdminCoursesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main courses page where course management is implemented
    router.push("/cursos");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Redirecionando para gerenciamento de cursos...</p>
      </div>
    </div>
  );
}
