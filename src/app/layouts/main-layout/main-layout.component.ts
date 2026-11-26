import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ToastContainerComponent } from '../../shared/components/toast/toast-container.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent, ToastContainerComponent],
  template: `
    <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-100">
      <!-- Global Toast Container -->
      <app-toast-container />

      <!-- Fixed Left Sidebar -->
      <app-sidebar />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <!-- Top Sticky Navbar -->
        <app-navbar />

        <!-- Router Scrollable Viewport -->
        <main class="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/70 dark:bg-slate-900/40">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}
