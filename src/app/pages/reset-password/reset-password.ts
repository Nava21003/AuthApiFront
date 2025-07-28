import { Component, inject, OnInit } from '@angular/core';
import { ResetPasswordRequest } from '../../interfaces/reset-password-request';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  resetPassword = {} as ResetPasswordRequest;
  auth = inject(Auth);
  router = inject(Router);
  route = inject(ActivatedRoute);
  matSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.resetPassword.email = params["email"];
      this.resetPassword.token = params["token"];
    });
  }

  resetPasswordHandle() {
    this.auth.resetPassword(this.resetPassword).subscribe({
      next: (response)=> {
         this.matSnackBar.open(response.message, 'Cerrar', {
            duration: 5000
          });

          this.router.navigate(['/login'])
      },
      error: (error: HttpErrorResponse)=>{
         this.matSnackBar.open(error.error.message, 'Cerrar', {
            duration:5000
          });
      },
    });
  }
}
