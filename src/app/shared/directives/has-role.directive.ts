import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private allowedRoles: Role[] = [];
  private isVisible = false;
  private sub?: Subscription;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appHasRole(roles: Role[] | Role) {
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.updateVisibility();
  }

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe(() => {
      this.updateVisibility();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateVisibility(): void {
    const userRole = this.authService.role;
    const hasPermission = userRole ? this.allowedRoles.includes(userRole) : false;

    if (hasPermission && !this.isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isVisible = true;
    } else if (!hasPermission && this.isVisible) {
      this.viewContainer.clear();
      this.isVisible = false;
    }
  }
}
