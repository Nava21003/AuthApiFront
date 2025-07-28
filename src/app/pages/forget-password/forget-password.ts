import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-forget-password',
  imports: [FormsModule, MatIcon, MatSnackBarModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css'
})

export class ForgetPassword {
  email!:string;
  auth = inject(Auth);
  MatSnackBar = inject(MatSnackBar);
  showEmailSent = false;
  isSubmitting = false;

  forgetPassword(){
    this.isSubmitting = true;
    this.auth.forgotPassword(this.email).subscribe({
      next:(response)=>{
        if(response.isSuccess){
          this.MatSnackBar.open(response.message,"Cerrar",{
            duration:5000
          });
          this.showEmailSent = true;
        } else {
          this.MatSnackBar.open(response.message,"Cerrar",{
            duration:5000
          });
        }
      },
      error:(error:HttpErrorResponse)=>{
        this.MatSnackBar.open(error.message,"Cerrar", {
            duration:5000
          });
      },
      complete:()=>{
        this.isSubmitting = false;
      }
    });
  }
}
