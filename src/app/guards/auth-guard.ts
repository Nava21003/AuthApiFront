import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const matSnackBar = inject(MatSnackBar);
  
  if(inject(Auth).isLoggedIn()){
    return true;
  }

  matSnackBar.open('No tienes acceso a esta pagina', 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
  });
  inject(Router).navigate(['/']);
  return false;

};
