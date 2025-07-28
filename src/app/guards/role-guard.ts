import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data["roles"] as string[];
  const authService = inject(Auth);
  const matSnakBar = inject(MatSnackBar);
  const router = inject(Router);

  const userRoles = authService.getRoles();

  if(!authService.isLoggedIn()){
    router.navigate(['/login']);

    matSnakBar.open('No tienes acceso a esta pagina', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    return false;
  }

  if(roles.some((role)=>userRoles?.includes(role))) return true;

  router.navigate(['/']);

  matSnakBar.open('No tienes acceso a esta pagina', 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
  });

  return false;

  
};
