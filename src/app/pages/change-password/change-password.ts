import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  newPassword!: string;
  currentPassword!: string;
  auth = inject(Auth);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router)

  changePassword(){
    this.auth.changePassword({
      email:this.auth.getUserDetail()?.email,
      newPassword:this.newPassword,
      currentPassword:this.currentPassword
    }).subscribe({
      next:(response)=>{
        if(response.isSuccess){
          this.matSnackBar.open(response.message,"Cerrar", {
            duration:3000
          });
          this.auth.logout();
          this.router.navigate(["/login"])
        } else{
          this.matSnackBar.open(response.message,"Cerrar", {
            duration:3000
          });
        }
      },
      error:(err:HttpErrorResponse) => {
        this.matSnackBar.open(err.error.message,"Cerrar", {
            duration:3000
          });
      }
    });
  }

}
