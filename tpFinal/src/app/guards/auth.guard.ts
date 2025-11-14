import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../components/log/auth/auth-service';

export const AuthGuard = (role: 'ADMIN' | 'USER'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

       if (!auth.isAuthenticated()) {
      router.navigate(['/auth']);
      return false;
    }


    const user = auth.getCurrentUser();

    if (!user) {
      router.navigate(['/auth']);
      return false;
    }

      // si se pide ADMIN y el user NO es admin
    if (role === 'ADMIN' && !user.isAdmin) {
      router.navigate(['/home']);
      return false;
    }

    return true;
  };
};
