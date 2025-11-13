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

export interface Trail {
  id: string;
  courseId: string;
  semesterNumber?: number;
  title: string;
  description: string;
  materials: Material[];
  createdAt: string;
}

export interface Material {
  id: string;
  trailId: string;
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
  private materials: Material[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined') return;
      const coursesData = localStorage.getItem('mockCourses');
      const trailsData = localStorage.getItem('mockTrails');
      const materialsData = localStorage.getItem('mockMaterials');

      if (coursesData) this.courses = JSON.parse(coursesData);
      if (trailsData) this.trails = JSON.parse(trailsData);
      if (materialsData) this.materials = JSON.parse(materialsData);
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('mockCourses', JSON.stringify(this.courses));
      localStorage.setItem('mockTrails', JSON.stringify(this.trails));
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

  createTrail(trailData: Omit<Trail, 'id' | 'createdAt' | 'materials'>): Trail {
    const newTrail: Trail = {
      ...trailData,
      id: `trail_${Date.now()}`,
      materials: [],
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

  addMaterialToTrail(trailId: string, material: Material): boolean {
    const trail = this.trails.find(t => t.id === trailId);
    if (!trail) return false;

    trail.materials.push(material);
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
    
    // Adicionar material à trilha
    const trail = this.trails.find(t => t.id === materialData.trailId);
    if (trail) {
      trail.materials.push(newMaterial);
    }

    this.saveToStorage();
    return newMaterial;
  }

  updateMaterial(materialId: string, updates: Partial<Material>): Material | null {
    const materialIndex = this.materials.findIndex(m => m.id === materialId);
    if (materialIndex === -1) return null;

    this.materials[materialIndex] = { ...this.materials[materialIndex], ...updates };

    // Atualizar na trilha também
    const trail = this.trails.find(t => t.materials.some(m => m.id === materialId));
    if (trail) {
      const trailMaterialIndex = trail.materials.findIndex(m => m.id === materialId);
      if (trailMaterialIndex !== -1) {
        trail.materials[trailMaterialIndex] = this.materials[materialIndex];
      }
    }

    this.saveToStorage();
    return this.materials[materialIndex];
  }

  removeMaterial(materialId: string): boolean {
    const materialIndex = this.materials.findIndex(m => m.id === materialId);
    if (materialIndex === -1) return false;

    this.materials.splice(materialIndex, 1);

    // Remover da trilha também
    const trail = this.trails.find(t => t.materials.some(m => m.id === materialId));
    if (trail) {
      const trailMaterialIndex = trail.materials.findIndex(m => m.id === materialId);
      if (trailMaterialIndex !== -1) {
        trail.materials.splice(trailMaterialIndex, 1);
      }
    }

    this.saveToStorage();
    return true;
  }

  getMaterialsByTrailId(trailId: string): Material[] {
    return this.materials.filter(material => material.trailId === trailId);
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
    if (typeof window === 'undefined') return;
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
    this.saveToStorage();
  }
}

export const mockCourseService = new MockCourseService();