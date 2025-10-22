/**
 * Mock Service para gerenciar entregas de materiais dos alunos
 */

export interface StudentSubmission {
  id: string;
  materialId: string;
  taskId: string;
  trailId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  feedback?: string;
  grade?: number;
  reviewedAt?: string;
  reviewedBy?: string;
}

class MockSubmissionService {
  private submissions: StudentSubmission[] = [];
  private storageKey = 'mockSubmissions';

  constructor() {
    this.loadFromStorage();
    this.createSampleData();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.submissions = JSON.parse(data);
      }
    } catch (error) {
      console.error('Erro ao carregar submissions:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.submissions));
    } catch (error) {
      console.error('Erro ao salvar submissions:', error);
    }
  }

  // Criar submission (aluno envia material)
  createSubmission(data: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>): StudentSubmission {
    const newSubmission: StudentSubmission = {
      ...data,
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    this.submissions.push(newSubmission);
    this.saveToStorage();
    return newSubmission;
  }

  // Buscar todas as submissions
  getAllSubmissions(): StudentSubmission[] {
    return [...this.submissions];
  }

  // Buscar submissions por material
  getSubmissionsByMaterial(materialId: string): StudentSubmission[] {
    return this.submissions.filter(s => s.materialId === materialId);
  }

  // Buscar submissions por tarefa
  getSubmissionsByTask(taskId: string): StudentSubmission[] {
    return this.submissions.filter(s => s.taskId === taskId);
  }

  // Buscar submissions por trilha
  getSubmissionsByTrail(trailId: string): StudentSubmission[] {
    return this.submissions.filter(s => s.trailId === trailId);
  }

  // Buscar submissions por status
  getSubmissionsByStatus(status: StudentSubmission['status']): StudentSubmission[] {
    return this.submissions.filter(s => s.status === status);
  }

  // Buscar submissions pendentes (para notificações)
  getPendingSubmissions(): StudentSubmission[] {
    return this.submissions.filter(s => s.status === 'pending');
  }

  // Buscar submission por ID
  getSubmissionById(id: string): StudentSubmission | undefined {
    return this.submissions.find(s => s.id === id);
  }

  // Atualizar feedback e nota
  reviewSubmission(
    submissionId: string, 
    feedback: string, 
    grade: number,
    status: 'reviewed' | 'approved' | 'rejected',
    reviewedBy: string
  ): StudentSubmission | null {
    const index = this.submissions.findIndex(s => s.id === submissionId);
    if (index === -1) return null;

    this.submissions[index] = {
      ...this.submissions[index],
      feedback,
      grade,
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy
    };

    this.saveToStorage();
    return this.submissions[index];
  }

  // Deletar submission
  deleteSubmission(id: string): boolean {
    const index = this.submissions.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.submissions.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  createSampleData() {
    if (this.submissions.length > 0) return;

    const mockCourseService = require('./mockCourseService').mockCourseService;
    const allTasks = mockCourseService.getAllTasks ? mockCourseService.getAllTasks() : [];
    
    if (allTasks.length === 0) {
      const sampleSubmissions: StudentSubmission[] = [
        {
          id: 'sub_1',
          materialId: 'sample_material_1',
          taskId: 'sample_task_1',
          trailId: 'sample_trail_1',
          studentId: 'student_1',
          studentName: 'João Silva',
          studentAvatar: '/img/avatar1.jpg',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          fileName: 'trabalho_introducao_programacao.pdf',
          fileType: 'application/pdf',
          fileSize: 2457600
        }
      ];
      this.submissions = sampleSubmissions;
      this.saveToStorage();
      return;
    }

    const sampleSubmissions: StudentSubmission[] = [];
    
    allTasks.slice(0, 4).forEach((task: any, index: number) => {
      const students = [
        { name: 'João Silva', avatar: '/img/avatar1.jpg' },
        { name: 'Maria Santos', avatar: '/img/avatar2.jpg' },
        { name: 'Pedro Oliveira', avatar: '/img/avatar3.jpg' },
        { name: 'Ana Costa', avatar: '/img/avatar4.jpg' },
        { name: 'Carlos Mendes', avatar: '/img/avatar5.jpg' },
        { name: 'Fernanda Lima', avatar: '/img/avatar6.jpg' }
      ];

      const numSubmissions = Math.min(2 + (index % 2), students.length);
      
      for (let i = 0; i < numSubmissions; i++) {
        const student = students[i];
        const hoursAgo = (i + 1) * (index + 1) * 2;
        const isPending = i < numSubmissions - 1;
        
        sampleSubmissions.push({
          id: `sub_${task.id}_${i + 1}`,
          materialId: task.materials && task.materials.length > 0 ? task.materials[0].id : `material_${task.id}`,
          taskId: task.id,
          trailId: task.trailId,
          studentId: `student_${i + 1}`,
          studentName: student.name,
          studentAvatar: student.avatar,
          submittedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
          status: isPending ? 'pending' : 'reviewed',
          fileName: `${task.title.toLowerCase().replace(/\s+/g, '_')}_${student.name.split(' ')[0].toLowerCase()}.pdf`,
          fileType: 'application/pdf',
          fileSize: 1048576 + Math.floor(Math.random() * 2097152),
          ...(isPending ? {} : {
            feedback: `Bom trabalho na tarefa "${task.title}"! Continue assim.`,
            grade: 7.5 + Math.random() * 2.5,
            reviewedAt: new Date(Date.now() - (hoursAgo - 4) * 60 * 60 * 1000).toISOString(),
            reviewedBy: 'Professor Carlos'
          })
        });
      }
    });
    
    this.submissions = sampleSubmissions;
    this.saveToStorage();
  }

  clearAll() {
    this.submissions = [];
    localStorage.removeItem(this.storageKey);
  }

  resetAndCreateSampleData() {
    this.clearAll();
    this.createSampleData();
  }

  // Contar submissions por status
  getSubmissionCountByStatus(): Record<StudentSubmission['status'], number> {
    return {
      pending: this.submissions.filter(s => s.status === 'pending').length,
      reviewed: this.submissions.filter(s => s.status === 'reviewed').length,
      approved: this.submissions.filter(s => s.status === 'approved').length,
      rejected: this.submissions.filter(s => s.status === 'rejected').length
    };
  }
}

export const mockSubmissionService = new MockSubmissionService();

