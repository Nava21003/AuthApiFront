import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, throwError } from 'rxjs';
import { routes } from '../app.routes';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.getToken()){
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authService.getToken()}`),
    });

    return next(cloned).pipe(
      catchError((err:HttpErrorResponse)=>{
        if(err.status == 401){
          authService.refreshToken({
            email:authService.getUserDetail()?.email,
            token:authService.getToken() || "",
            refreshToken:authService.getRefreshToken() || "",
          }).subscribe({
            next:(response) => {
              if(response.isSuccess){
                localStorage.setItem("user", JSON.stringify(response));
                const cloned = req.clone({
                  setHeaders:{
                    Authorization: `Bearer ${response.token}`,
                  },
                });
              }
            },
            error:()=>{
              authService.logout();
              router.navigate(['/login']);
            },
          });
        }
        return throwError(err)
      })
    );
  };

  return next(req);
  
};
