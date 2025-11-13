const fs = require('fs');

const file = fs.readFileSync('src/app/(private)/cursos/[courseId]/semestre/[semesterId]/page.tsx', 'utf8');

const activities = {
  '2-2': {
    title: 'Consultas SQL Avançadas',
    desc: 'Consultas SQL avançadas',
    type: 'prática',
    duration: '3 horas',
    difficulty: 'Intermediário',
    progress: 100
  },
  '2-3': {
    title: 'Modelagem de Dados',
    desc: 'Modelagem de dados',
    type: 'teórica',
    duration: '2 horas',
    difficulty: 'Iniciante',
    progress: 100
  },
  '3-1': {
    title: 'Introdução ao React',
    desc: 'Introdução ao React',
    type: 'teórica',
    duration: '3 horas',
    difficulty: 'Intermediário',
    progress: 100
  },
  '3-2': {
    title: 'Hooks e Estado',
    desc: 'Hooks e estado no React',
    type: 'prática',
    duration: '4 horas',
    difficulty: 'Intermediário',
    progress: 0
  },
  '3-3': {
    title: 'Roteamento com React Router',
    desc: 'Roteamento React',
    type: 'prática',
    duration: '3 horas',
    difficulty: 'Intermediário',
    progress: 0
  },
  '3-4': {
    title: 'Projeto - Dashboard Interativo',
    desc: 'Projeto de dashboard',
    type: 'projeto',
    duration: '8 horas',
    difficulty: 'Avançado',
    progress: 0
  },
  '4-1': {
    title: 'Fundamentos de Design',
    desc: 'Fundamentos de design',
    type: 'teórica',
    duration: '2 horas',
    difficulty: 'Iniciante',
    progress: 0
  },
  '4-2': {
    title: 'Figma e Prototipagem',
    desc: 'Figma e prototipagem',
    type: 'prática',
    duration: '4 horas',
    difficulty: 'Iniciante',
    progress: 0
  },
  '4-3': {
    title: 'Projeto - Redesign de App',
    desc: 'Redesign de app',
    type: 'projeto',
    duration: '6 horas',
    difficulty: 'Intermediário',
    progress: 0
  }
};

let updated = file;

for (const [id, data] of Object.entries(activities)) {
  const regex = new RegExp(`(id: '${id}',\\s*title: '${data.title}',)`, 'g');
  const replacement = `$1\n            description: '${data.desc}',\n            type: '${data.type}',\n            duration: '${data.duration}',\n            difficulty: '${data.difficulty}',\n            progress: ${data.progress},`;
  updated = updated.replace(regex, replacement);
}

fs.writeFileSync('src/app/(private)/cursos/[courseId]/semestre/[semesterId]/page.tsx', updated);
console.log('Activities updated\!');
