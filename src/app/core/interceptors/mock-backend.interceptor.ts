import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { Course, Role, User } from '../models';

const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Fabiola Cadillo',
    email: 'admin@zegel.edu.pe',
    role: 'admin',
    avatar: 'assets/team/fabiola-cadillo.jpg',
    department: 'Dirección Académica',
    status: 'activo',
    createdAt: '2025-01-15'
  },
  {
    id: 'u-2',
    name: 'Brayan Flores',
    email: 'profesor@zegel.edu.pe',
    role: 'profesor',
    avatar: 'assets/team/brayan-flores.png',
    department: 'Tecnologías de la Información',
    status: 'activo',
    createdAt: '2025-02-01'
  },
  {
    id: 'u-3',
    name: 'Estefania Orellana',
    email: 'estudiante@zegel.edu.pe',
    role: 'estudiante',
    avatar: 'assets/team/estefania-orellana.jpg',
    department: 'Diseño y Desarrollo de Software - 4to Ciclo',
    status: 'activo',
    createdAt: '2025-03-10'
  },
  {
    id: 'u-4',
    name: 'Mg. Roberto Sánchez',
    email: 'roberto.sanchez@zegel.edu.pe',
    role: 'profesor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Administración y Negocios',
    status: 'activo',
    createdAt: '2025-02-14'
  },
  {
    id: 'u-5',
    name: 'Mateo Quispe Huamán',
    email: 'mateo.quispe@zegel.edu.pe',
    role: 'estudiante',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Diseño y Desarrollo de Software',
    status: 'activo',
    createdAt: '2025-03-12'
  }
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'c-101',
    code: 'DINT-301',
    title: 'Desarrollo de Interfaces III',
    description: 'Arquitectura avanzada SPA con Angular, Patrones de diseño, RxJS, Guards reactivos y Tailwind CSS.',
    credits: 4,
    instructorId: 'u-2',
    instructorName: 'Brayan Flores',
    status: 'activo',
    enrolledStudentsCount: 28,
    maxCapacity: 35,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    schedule: 'Lunes y Miércoles 19:00 - 21:30',
    progressPercentage: 75,
    syllabus: [
      'Semana 1-3: Arquitectura Modular, Standalone Components y POO en Angular',
      'Semana 4-6: Pipes, Directivas personalizadas y Enrutamiento Lazy Loading',
      'Semana 7-10: Guards funcionales, JWT Interceptors y consumo reactivo con RxJS',
      'Semana 11-14: Evaluación Final y Despliegue de SPA Profesional'
    ]
  },
  {
    id: 'c-102',
    code: 'PROG-204',
    title: 'Arquitectura Cloud & Microservicios',
    description: 'Diseño de arquitecturas escalables, Docker, Kubernetes, AWS Lambda y patrones de microfrontends.',
    credits: 5,
    instructorId: 'u-2',
    instructorName: 'Brayan Flores',
    status: 'activo',
    enrolledStudentsCount: 32,
    maxCapacity: 40,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    schedule: 'Martes y Jueves 18:30 - 21:00',
    progressPercentage: 45,
    syllabus: [
      'Módulo 1: Fundamentos de Cloud Computing y Contenedores',
      'Módulo 2: Orquestación con Kubernetes y Service Mesh',
      'Módulo 3: Serverless y Patrones de Alta Disponibilidad'
    ]
  },
  {
    id: 'c-103',
    code: 'UX-105',
    title: 'Diseño UX/UI & Design Systems',
    description: 'Investigación de usuarios, Figma profesional, Design Tokens y accesibilidad web WCAG 2.1.',
    credits: 3,
    instructorId: 'u-4',
    instructorName: 'Mg. Roberto Sánchez',
    status: 'proximo',
    enrolledStudentsCount: 18,
    maxCapacity: 30,
    coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    schedule: 'Sábados 09:00 - 13:00',
    progressPercentage: 0,
    syllabus: [
      'Semana 1: Heurísticas de Nielsen y Arquitectura de Información',
      'Semana 2: Prototipado en Figma y Sistemas de Diseño',
      'Semana 3: Pruebas de usabilidad y métricas UX'
    ]
  },
  {
    id: 'c-104',
    code: 'SEC-402',
    title: 'Seguridad en Aplicaciones Web',
    description: 'OWASP Top 10, autenticación OAuth2/OIDC, tokens JWT con firmas asimétricas y protección CSRF/XSS.',
    credits: 4,
    instructorId: 'u-2',
    instructorName: 'Brayan Flores',
    status: 'finalizado',
    enrolledStudentsCount: 25,
    maxCapacity: 25,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    schedule: 'Viernes 19:00 - 22:00',
    progressPercentage: 100,
    syllabus: [
      'Módulo 1: Criptografía y firmas digitales',
      'Módulo 2: Protocolos JWT y OAuth2',
      'Módulo 3: Hardening de API REST'
    ]
  }
];

function generateSimulatedJwt(user: User): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    iat: now,
    exp: now + 3600 * 8 // 8 horas de validez
  };

  const b64Header = btoa(JSON.stringify(header));
  const b64Payload = btoa(JSON.stringify(payload));
  const simulatedSignature = btoa('educore-zegel-secret-sign-' + user.id);

  return `${b64Header}.${b64Payload}.${simulatedSignature}`;
}

export const mockBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const { url, method, body, headers } = req;

  // Solo interceptar llamadas dirigidas a /api/
  if (!url.startsWith('/api/')) {
    return next(req);
  }

  // Siempre actualizar o sincronizar mock inicial de la base de datos si falta o está corrupto
  const storedUsersStr = localStorage.getItem('educore_mock_users');
  if (!storedUsersStr || storedUsersStr.includes('Fabiola Ramos') || storedUsersStr.includes('Carlos Mendoza') || !storedUsersStr.includes('fabiola-cadillo.jpg')) {
    localStorage.setItem('educore_mock_users', JSON.stringify(INITIAL_USERS));
  }
  const storedCoursesStr = localStorage.getItem('educore_mock_courses');
  if (!storedCoursesStr || storedCoursesStr.includes('Carlos Mendoza')) {
    localStorage.setItem('educore_mock_courses', JSON.stringify(INITIAL_COURSES));
  }

  const getUsers = (): User[] => JSON.parse(localStorage.getItem('educore_mock_users') || '[]');
  const saveUsers = (users: User[]) => localStorage.setItem('educore_mock_users', JSON.stringify(users));

  const getCourses = (): Course[] => JSON.parse(localStorage.getItem('educore_mock_courses') || '[]');
  const saveCourses = (courses: Course[]) => localStorage.setItem('educore_mock_courses', JSON.stringify(courses));

  // Simular latencia de red realista de 280ms
  const networkDelay = 280;

  // =================== AUTH LOGIN ===================
  if (url === '/api/auth/login' && method === 'POST') {
    const creds = body as { email: string; password?: string };
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === creds.email?.toLowerCase());

    if (!user) {
      return throwError(() => ({
        status: 401,
        statusText: 'Unauthorized',
        error: { message: 'Credenciales inválidas. Verifica tu correo institucional.' }
      })).pipe(delay(networkDelay));
    }

    const token = generateSimulatedJwt(user);
    const authResponse = {
      token,
      user,
      expiresIn: 3600 * 8
    };

    return of(new HttpResponse({ status: 200, body: authResponse })).pipe(delay(networkDelay));
  }

  // Validar token para rutas protegidas
  const authHeader = headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return throwError(() => ({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Token de autorización ausente o inválido' }
    })).pipe(delay(networkDelay));
  }

  // =================== USERS ENDPOINTS ===================
  // GET /api/users
  if (url === '/api/users' && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: getUsers() })).pipe(delay(networkDelay));
  }

  // POST /api/users
  if (url === '/api/users' && method === 'POST') {
    const newUser = body as Partial<User>;
    const users = getUsers();
    const createdUser: User = {
      id: 'u-' + Date.now(),
      name: newUser.name || 'Nuevo Usuario',
      email: newUser.email || '',
      role: newUser.role || 'estudiante',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      department: newUser.department || 'General',
      status: newUser.status || 'activo',
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.unshift(createdUser);
    saveUsers(users);
    return of(new HttpResponse({ status: 201, body: createdUser })).pipe(delay(networkDelay));
  }

  // GET /api/users/:id
  if (url.match(/\/api\/users\/[a-zA-Z0-9_-]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    const user = getUsers().find(u => u.id === id);
    if (!user) {
      return throwError(() => ({ status: 404, error: { message: 'Usuario no encontrado' } })).pipe(delay(networkDelay));
    }
    return of(new HttpResponse({ status: 200, body: user })).pipe(delay(networkDelay));
  }

  // PUT /api/users/:id
  if (url.match(/\/api\/users\/[a-zA-Z0-9_-]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    const updateData = body as Partial<User>;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) {
      return throwError(() => ({ status: 404, error: { message: 'Usuario no encontrado' } })).pipe(delay(networkDelay));
    }
    const updated = { ...users[idx], ...updateData };
    users[idx] = updated;
    saveUsers(users);
    return of(new HttpResponse({ status: 200, body: updated })).pipe(delay(networkDelay));
  }

  // DELETE /api/users/:id
  if (url.match(/\/api\/users\/[a-zA-Z0-9_-]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    const users = getUsers().filter(u => u.id !== id);
    saveUsers(users);
    return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(networkDelay));
  }

  // =================== COURSES ENDPOINTS ===================
  // GET /api/courses
  if (url === '/api/courses' && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: getCourses() })).pipe(delay(networkDelay));
  }

  // POST /api/courses
  if (url === '/api/courses' && method === 'POST') {
    const newCourse = body as Partial<Course>;
    const courses = getCourses();
    const createdCourse: Course = {
      id: 'c-' + Date.now(),
      code: newCourse.code || 'ZEG-' + Math.floor(100 + Math.random() * 900),
      title: newCourse.title || 'Nuevo Curso',
      description: newCourse.description || '',
      credits: Number(newCourse.credits) || 3,
      instructorId: newCourse.instructorId || 'u-2',
      instructorName: newCourse.instructorName || 'Ing. Carlos Mendoza',
      status: newCourse.status || 'proximo',
      enrolledStudentsCount: 0,
      maxCapacity: Number(newCourse.maxCapacity) || 30,
      coverImage: newCourse.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      schedule: newCourse.schedule || 'Por coordinar',
      progressPercentage: 0,
      syllabus: newCourse.syllabus?.length ? newCourse.syllabus : ['Introducción general y expectativas', 'Desarrollo de contenidos', 'Proyecto Integrador']
    };
    courses.unshift(createdCourse);
    saveCourses(courses);
    return of(new HttpResponse({ status: 201, body: createdCourse })).pipe(delay(networkDelay));
  }

  // GET /api/courses/:id
  if (url.match(/\/api\/courses\/[a-zA-Z0-9_-]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    const course = getCourses().find(c => c.id === id);
    if (!course) {
      return throwError(() => ({ status: 404, error: { message: 'Curso no encontrado' } })).pipe(delay(networkDelay));
    }
    return of(new HttpResponse({ status: 200, body: course })).pipe(delay(networkDelay));
  }

  // PUT /api/courses/:id
  if (url.match(/\/api\/courses\/[a-zA-Z0-9_-]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    const updateData = body as Partial<Course>;
    const courses = getCourses();
    const idx = courses.findIndex(c => c.id === id);
    if (idx === -1) {
      return throwError(() => ({ status: 404, error: { message: 'Curso no encontrado' } })).pipe(delay(networkDelay));
    }
    const updated = { ...courses[idx], ...updateData };
    courses[idx] = updated;
    saveCourses(courses);
    return of(new HttpResponse({ status: 200, body: updated })).pipe(delay(networkDelay));
  }

  // DELETE /api/courses/:id
  if (url.match(/\/api\/courses\/[a-zA-Z0-9_-]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    const courses = getCourses().filter(c => c.id !== id);
    saveCourses(courses);
    return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(networkDelay));
  }

  return next(req);
};
