import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Role, User } from '../../../core/models';
import { RoleBadgePipe } from '../../../shared/pipes/role-badge.pipe';
import { HighlightRowDirective } from '../../../shared/directives/highlight-row.directive';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleBadgePipe, HighlightRowDirective],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Directorio de Usuarios</h2>
            <span class="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
              ROL: ADMIN ONLY
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Control de acceso, roles institucionales y perfiles académicos.</p>
        </div>

        <button
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Registrar Usuario
        </button>
      </div>

      <!-- FILTER / SEARCH -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-full md:w-96">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Buscar por nombre, correo o departamento..."
            class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <span class="text-xs text-slate-400 whitespace-nowrap">Filtrar Rol:</span>
          <select
            [(ngModel)]="selectedRole"
            class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="profesor">Profesor</option>
            <option value="estudiante">Estudiante</option>
          </select>
        </div>
      </div>

      <!-- USERS TABLE -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/70 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th class="py-3 px-5">Usuario / Perfil</th>
                <th class="py-3 px-5">Correo Institucional</th>
                <th class="py-3 px-5">Rol Institucional</th>
                <th class="py-3 px-5">Área / Carrera</th>
                <th class="py-3 px-5">Estado</th>
                <th class="py-3 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let user of filteredUsers" appHighlightRow class="group">
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3">
                    <img [src]="user.avatar" [alt]="user.name" class="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200" />
                    <div>
                      <h4 class="font-bold text-slate-900 dark:text-white text-xs">{{ user.name }}</h4>
                      <p class="text-[10px] text-slate-400 font-mono">ID: {{ user.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-5 text-slate-600 dark:text-slate-300 font-medium">
                  {{ user.email }}
                </td>
                <td class="py-3.5 px-5">
                  <span
                    [ngClass]="(user.role | roleBadge).bgClass + ' ' + (user.role | roleBadge).textClass"
                    class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  >
                    {{ (user.role | roleBadge).label }}
                  </span>
                </td>
                <td class="py-3.5 px-5 text-slate-600 dark:text-slate-400">
                  {{ user.department || 'General' }}
                </td>
                <td class="py-3.5 px-5">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                    [ngClass]="user.status === 'activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="user.status === 'activo' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    {{ user.status | uppercase }}
                  </span>
                </td>
                <td class="py-3.5 px-5 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button
                      (click)="openEditModal(user)"
                      class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deleteUser(user.id)"
                      class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="filteredUsers.length === 0">
                <td colspan="6" class="py-8 text-center text-slate-400 text-xs">
                  No se encontraron usuarios con los criterios indicados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL CREAR / EDITAR USUARIO -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ editingUserId ? 'Editar Perfil de Usuario' : 'Registrar Nuevo Usuario' }}
            </h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <form (ngSubmit)="saveUser()" class="mt-4 space-y-3.5 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
              <input
                type="text"
                [(ngModel)]="formData.name"
                name="name"
                required
                placeholder="Ej: Lic. María González"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico Institucional</label>
              <input
                type="email"
                [(ngModel)]="formData.email"
                name="email"
                required
                placeholder="ejemplo@zegel.edu.pe"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                <select
                  [(ngModel)]="formData.role"
                  name="role"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  <option value="admin">Administrador</option>
                  <option value="profesor">Profesor</option>
                  <option value="estudiante">Estudiante</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                <select
                  [(ngModel)]="formData.status"
                  name="status"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Departamento o Carrera</label>
              <input
                type="text"
                [(ngModel)]="formData.department"
                name="department"
                placeholder="Ej: Tecnologías de la Información"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Avatar (Opcional)</label>
              <input
                type="text"
                [(ngModel)]="formData.avatar"
                name="avatar"
                placeholder="https://..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>

            <div class="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30"
              >
                Guardar Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  authService = inject(AuthService);

  users: User[] = [];
  searchTerm = '';
  selectedRole = 'todos';

  isModalOpen = false;
  editingUserId: string | null = null;
  formData: Partial<User> = {
    name: '',
    email: '',
    role: 'estudiante',
    department: '',
    status: 'activo',
    avatar: ''
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  get filteredUsers(): User[] {
    return this.users.filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (u.department && u.department.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchRole = this.selectedRole === 'todos' || u.role === this.selectedRole;
      return matchSearch && matchRole;
    });
  }

  openCreateModal(): void {
    this.editingUserId = null;
    this.formData = {
      name: '',
      email: '',
      role: 'estudiante',
      department: 'Diseño y Desarrollo de Software',
      status: 'activo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    this.isModalOpen = true;
  }

  openEditModal(user: User): void {
    this.editingUserId = user.id;
    this.formData = { ...user };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveUser(): void {
    if (!this.formData.avatar) {
      this.formData.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    }

    if (this.editingUserId) {
      this.userService.updateUser(this.editingUserId, this.formData).subscribe(() => {
        this.closeModal();
        this.loadUsers();
      });
    } else {
      this.userService.createUser(this.formData as User).subscribe(() => {
        this.closeModal();
        this.loadUsers();
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar a este usuario de EduCore?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
