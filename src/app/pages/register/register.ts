import { Component, inject, Inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { RoleService } from '../../services/role';
import { Role } from '../../interfaces/role';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Auth } from '../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';




@Component({
  selector: 'app-register',
  imports: [MatInputModule, MatIconModule, MatSelectModule, RouterLink, ReactiveFormsModule, AsyncPipe, CommonModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  roleService = inject(RoleService);
  roles$!: Observable<Role[]>;
  matSnackBar = inject(MatSnackBar);
  authService = inject(Auth);
  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  router = inject(Router);
  confirmPasswordHide: boolean = true;
  passwordHide: boolean = true;
  errors!: ValidationError[];

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log(response.message,'Close',{
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/login']);
      },
      error: (err:HttpErrorResponse) => {
        if(err!.status === 400){
          this.errors = err!.error;
          this.matSnackBar.open('Validation error', 'Close',{
            duration: 5000,
            horizontalPosition: 'center',
          });
        }
      },
      complete: () => console.log('complete')
    });
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      roles: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: this.passwordValidator
    }

    );

    this.roles$ = this.roleService.getRoles();

  }

  private passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

}
