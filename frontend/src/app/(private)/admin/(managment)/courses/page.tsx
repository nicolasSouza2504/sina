import QuickActions, {
  QuickActionsProps,
} from "@/components/admin/quickActions";

export default function CoursesPage() {
    return (
    <div>
      <h1>Gerenciamento de Cursos</h1>
      {/* Formulário de gerenciamento de cursos vai aqui */}

      {
        <QuickActions />
      }
    </div>
  );
}
