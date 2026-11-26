export type Role = 'admin' | 'profesor' | 'estudiante';

export type CourseStatus = 'activo' | 'proximo' | 'finalizado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  status: 'activo' | 'inactivo';
  createdAt?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  instructorId: string;
  instructorName: string;
  status: CourseStatus;
  enrolledStudentsCount: number;
  maxCapacity: number;
  coverImage: string;
  syllabus?: string[];
  schedule?: string;
  progressPercentage?: number; // Para vista de estudiante
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
