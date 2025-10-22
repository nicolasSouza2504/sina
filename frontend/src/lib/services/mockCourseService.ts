export interface Semester {
  number: number;
  title: string;
  status: 'locked' | 'unlocked' | 'active';
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  year: string;
  duration: string;
  totalSemesters: number;
  status: 'active' | 'inactive' | 'draft';
  maxStudents: number;
  requirements: string[];
  semesters: Semester[];
  createdAt: string;
}

export interface Task {
  id: string;
  trailId: string;
  title: string;
  description: string;
  type: 'teórica' | 'prática' | 'projeto' | 'avaliação';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  estimatedTime: string;
  status: 'locked' | 'unlocked' | 'completed';
  materials: Material[];
  createdAt: string;
}

export interface Trail {
  id: string;
  courseId: string;
  semesterNumber?: number;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
}

export interface Material {
  id: string;
  taskId: string;
  type: 'text' | 'video' | 'link' | 'file';
  title: string;
  content?: string;
  url?: string;
  fileData?: string;
  fileName?: string;
  createdAt: string;
}

// Alias para compatibilidade
export type MockMaterial = Material;

class MockCourseService {
  private courses: Course[] = [];
  private trails: Trail[] = [];
  private tasks: Task[] = [];
  private materials: Material[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const coursesData = localStorage.getItem('mockCourses');
      const trailsData = localStorage.getItem('mockTrails');
      const tasksData = localStorage.getItem('mockTasks');
      const materialsData = localStorage.getItem('mockMaterials');

      if (coursesData) this.courses = JSON.parse(coursesData);
      if (trailsData) {
        this.trails = JSON.parse(trailsData);
        // Garantir que todas as trilhas tenham o array tasks
        this.trails.forEach(trail => {
          if (!trail.tasks) {
            trail.tasks = [];
          }
        });
      }
      if (tasksData) this.tasks = JSON.parse(tasksData);
      if (materialsData) this.materials = JSON.parse(materialsData);
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('mockCourses', JSON.stringify(this.courses));
      localStorage.setItem('mockTrails', JSON.stringify(this.trails));
      localStorage.setItem('mockTasks', JSON.stringify(this.tasks));
      localStorage.setItem('mockMaterials', JSON.stringify(this.materials));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }

  createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'semesters'>): Course {
    const semesters: Semester[] = [];
    
    // Criar semestres automaticamente baseado no totalSemesters
    for (let i = 1; i <= courseData.totalSemesters; i++) {
      semesters.push({
        number: i,
        title: `Semestre ${i}`,
        status: i === 1 ? 'unlocked' : 'locked', // Primeiro semestre desbloqueado
        description: `Conteúdo do ${i}º semestre`,
      });
    }

    const newCourse: Course = {
      ...courseData,
      id: `course_${Date.now()}`,
      semesters,
      createdAt: new Date().toISOString(),
    };

    this.courses.push(newCourse);
    this.saveToStorage();
    return newCourse;
  }

  getAllCourses(): Course[] {
    return [...this.courses];
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  createTrail(trailData: Omit<Trail, 'id' | 'createdAt' | 'tasks'>): Trail {
    const newTrail: Trail = {
      ...trailData,
      id: `trail_${Date.now()}`,
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    this.trails.push(newTrail);
    this.saveToStorage();
    return newTrail;
  }

  getAllTrails(): Trail[] {
    return [...this.trails];
  }

  getTrailsByCourseId(courseId: string): Trail[] {
    return this.trails.filter(trail => trail.courseId === courseId);
  }

  getTrailById(id: string): Trail | undefined {
    return this.trails.find(trail => trail.id === id);
  }

  deleteTrail(trailId: string): boolean {
    const trailIndex = this.trails.findIndex(t => t.id === trailId);
    if (trailIndex === -1) return false;

    this.trails.splice(trailIndex, 1);
    this.saveToStorage();
    return true;
  }

  // Métodos para Tarefas
  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'materials'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      materials: [],
      createdAt: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    
    // Adicionar tarefa à trilha
    const trail = this.trails.find(t => t.id === taskData.trailId);
    if (trail) {
      // Garantir que a trilha tenha o array tasks
      if (!trail.tasks) {
        trail.tasks = [];
      }
      trail.tasks.push(newTask);
    }

    this.saveToStorage();
    return newTask;
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTasksByTrailId(trailId: string): Task[] {
    return this.tasks.filter(task => task.trailId === trailId);
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  updateTask(taskId: string, updates: Partial<Task>): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    
    // Atualizar na trilha também
    this.trails.forEach(trail => {
      const taskInTrailIndex = trail.tasks.findIndex(t => t.id === taskId);
      if (taskInTrailIndex !== -1) {
        trail.tasks[taskInTrailIndex] = { ...trail.tasks[taskInTrailIndex], ...updates };
      }
    });

    this.saveToStorage();
    return true;
  }

  deleteTask(taskId: string): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;

    // Remover da trilha também
    this.trails.forEach(trail => {
      const taskInTrailIndex = trail.tasks.findIndex(t => t.id === taskId);
      if (taskInTrailIndex !== -1) {
        trail.tasks.splice(taskInTrailIndex, 1);
      }
    });

    this.tasks.splice(taskIndex, 1);
    this.saveToStorage();
    return true;
  }

  addMaterialToTask(taskId: string, material: Material): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return false;

    task.materials.push(material);
    this.saveToStorage();
    return true;
  }

  addMaterial(materialData: Omit<Material, 'id' | 'createdAt'>): Material {
    const newMaterial: Material = {
      ...materialData,
      id: `material_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.materials.push(newMaterial);
    
    // Adicionar material à tarefa
    const task = this.tasks.find(t => t.id === materialData.taskId);
    if (task) {
      task.materials.push(newMaterial);
    }

    this.saveToStorage();
    return newMaterial;
  }

  updateMaterial(materialId: string, updates: Partial<Material>): Material | null {
    const materialIndex = this.materials.findIndex(m => m.id === materialId);
    if (materialIndex === -1) return null;

    this.materials[materialIndex] = { ...this.materials[materialIndex], ...updates };

    // Atualizar na tarefa também
    const task = this.tasks.find(t => t.materials.some(m => m.id === materialId));
    if (task) {
      const taskMaterialIndex = task.materials.findIndex(m => m.id === materialId);
      if (taskMaterialIndex !== -1) {
        task.materials[taskMaterialIndex] = this.materials[materialIndex];
      }
    }

    this.saveToStorage();
    return this.materials[materialIndex];
  }

  removeMaterial(materialId: string): boolean {
    const materialIndex = this.materials.findIndex(m => m.id === materialId);
    if (materialIndex === -1) return false;

    this.materials.splice(materialIndex, 1);

    // Remover da tarefa também
    const task = this.tasks.find(t => t.materials.some(m => m.id === materialId));
    if (task) {
      const taskMaterialIndex = task.materials.findIndex(m => m.id === materialId);
      if (taskMaterialIndex !== -1) {
        task.materials.splice(taskMaterialIndex, 1);
      }
    }

    this.saveToStorage();
    return true;
  }

  getMaterialsByTaskId(taskId: string): Material[] {
    return this.materials.filter(material => material.taskId === taskId);
  }

  getMaterialById(id: string): Material | undefined {
    return this.materials.find(material => material.id === id);
  }

  // Métodos para controle de semestres
  updateSemesterStatus(courseId: string, semesterNumber: number, status: 'locked' | 'unlocked' | 'active'): boolean {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return false;

    const semester = course.semesters.find(s => s.number === semesterNumber);
    if (!semester) return false;

    semester.status = status;
    this.saveToStorage();
    return true;
  }

  getSemestersByCourseId(courseId: string): Semester[] {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.semesters : [];
  }

  unlockSemester(courseId: string, semesterNumber: number): boolean {
    return this.updateSemesterStatus(courseId, semesterNumber, 'unlocked');
  }

  lockSemester(courseId: string, semesterNumber: number): boolean {
    return this.updateSemesterStatus(courseId, semesterNumber, 'locked');
  }

  activateSemester(courseId: string, semesterNumber: number): boolean {
    return this.updateSemesterStatus(courseId, semesterNumber, 'active');
  }

  updateSemester(courseId: string, semesterNumber: number, updates: Partial<Semester>): boolean {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return false;

    const semester = course.semesters.find(s => s.number === semesterNumber);
    if (!semester) return false;

    Object.assign(semester, updates);
    this.saveToStorage();
    return true;
  }

  // Método para criar dados de exemplo para teste
  createSampleData(): void {
    // Verifica se já existem dados
    if (this.courses.length > 0) return;

    const sampleCourse: Course = {
      id: 'sample_course_1',
      title: 'Desenvolvimento Web Full Stack',
      description: 'Curso completo de desenvolvimento web com tecnologias modernas',
      year: '2024',
      duration: '2 anos',
      totalSemesters: 4,
      status: 'active',
      maxStudents: 50,
      requirements: ['Conhecimento básico em programação', 'Inglês básico'],
      semesters: [
        {
          number: 1,
          title: 'Fundamentos da Programação',
          status: 'active',
          startDate: '2024-02-01',
          endDate: '2024-07-31',
          description: 'Introdução aos conceitos básicos de programação'
        },
        {
          number: 2,
          title: 'Desenvolvimento Frontend',
          status: 'unlocked',
          startDate: '2024-08-01',
          endDate: '2025-01-31',
          description: 'HTML, CSS, JavaScript e frameworks modernos'
        },
        {
          number: 3,
          title: 'Desenvolvimento Backend',
          status: 'locked',
          startDate: '2025-02-01',
          endDate: '2025-07-31',
          description: 'Node.js, Python, bancos de dados e APIs'
        },
        {
          number: 4,
          title: 'Projeto Integrador',
          status: 'locked',
          startDate: '2025-08-01',
          endDate: '2026-01-31',
          description: 'Desenvolvimento de projeto completo'
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.courses.push(sampleCourse);

    // Criar trilhas de exemplo
    const trail1 = this.createTrail({
      courseId: 'sample_course_1',
      semesterNumber: 1,
      title: 'Fundamentos de Programação',
      description: 'Aprenda os conceitos básicos de programação e lógica de programação'
    });

    const trail2 = this.createTrail({
      courseId: 'sample_course_1',
      semesterNumber: 2,
      title: 'Desenvolvimento Frontend',
      description: 'HTML, CSS, JavaScript e frameworks modernos'
    });

    // Criar tarefas para a trilha 1
    const task1 = this.createTask({
      trailId: trail1.id,
      title: 'Introdução à Programação',
      description: 'Conceitos básicos de programação e algoritmos',
      type: 'teórica',
      difficulty: 'Iniciante',
      estimatedTime: '8 horas',
      status: 'unlocked'
    });

    const task2 = this.createTask({
      trailId: trail1.id,
      title: 'Estruturas de Dados',
      description: 'Arrays, listas e estruturas básicas de dados',
      type: 'prática',
      difficulty: 'Iniciante',
      estimatedTime: '12 horas',
      status: 'unlocked'
    });

    // Criar tarefas para a trilha 2
    const task3 = this.createTask({
      trailId: trail2.id,
      title: 'HTML e CSS Básico',
      description: 'Estrutura e estilização de páginas web',
      type: 'teórica',
      difficulty: 'Iniciante',
      estimatedTime: '10 horas',
      status: 'locked'
    });

    const task4 = this.createTask({
      trailId: trail2.id,
      title: 'JavaScript Fundamentos',
      description: 'Sintaxe básica e conceitos do JavaScript',
      type: 'prática',
      difficulty: 'Intermediário',
      estimatedTime: '15 horas',
      status: 'locked'
    });

    // Criar alguns materiais de exemplo
    this.addMaterial({
      taskId: task1.id,
      type: 'text',
      title: 'Introdução à Programação',
      content: 'A programação é a arte de resolver problemas através de algoritmos...'
    });

    this.addMaterial({
      taskId: task1.id,
      type: 'video',
      title: 'Vídeo: Primeiros Passos',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    });

    this.addMaterial({
      taskId: task2.id,
      type: 'text',
      title: 'Arrays e Listas',
      content: 'Arrays são estruturas de dados que permitem armazenar múltiplos valores...'
    });

    this.saveToStorage();
  }

  // Método para limpar e recriar dados com estrutura correta
  resetDataWithNewStructure(): void {
    // Limpar localStorage
    localStorage.removeItem('mockCourses');
    localStorage.removeItem('mockTrails');
    localStorage.removeItem('mockTasks');
    localStorage.removeItem('mockMaterials');
    
    // Limpar arrays
    this.courses = [];
    this.trails = [];
    this.tasks = [];
    this.materials = [];
    
    // Recriar dados de exemplo
    this.createSampleData();
  }
}

export const mockCourseService = new MockCourseService();