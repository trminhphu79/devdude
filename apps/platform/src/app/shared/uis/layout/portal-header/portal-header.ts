import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminAuthStore } from '../../../store/admin-auth';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-portal-header',
  imports: [CommonModule],
  templateUrl: './portal-header.html',
  styleUrl: './portal-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalHeader {
  private _authStore = inject(AdminAuthStore);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  user = this._authStore.state;

  logout() {
    this._authService.logout().subscribe({
      next: () => {
        this._authStore.clear();
        this._router.navigate(['/auth']);
      },
      error: () => {
        // Even if logout API fails, clear local state
        this._authStore.clear();
        this._router.navigate(['/auth']);
      },
    });
  }
}
