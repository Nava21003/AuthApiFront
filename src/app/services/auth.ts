import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Login } from '../pages/login/login';
import { map, Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Register } from '../pages/register/register';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { ForgetPassword } from '../pages/forget-password/forget-password';
import { ResetPassword } from '../pages/reset-password/reset-password';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  apiUrl: string = environment.apiUrl;
  private userKey = 'user';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, JSON.stringify(response));
          }
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/register`, data)
  }

  getDetail = (): Observable<UserDetail> => {
    return this.http.get<UserDetail>(`${this.apiUrl}account/detail`);
  }
  
  forgotPassword = (email:String): Observable<AuthResponse> =>{
    return this.http.post<AuthResponse>(`${this.apiUrl}account/forgot-password`, {
      email,
    });
  }

  resetPassword = (data:ResetPasswordRequest): Observable<AuthResponse> =>{
    return this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data);
  }

  changePassword = (data:ChangePasswordRequest): Observable<AuthResponse> =>{
    return this.http.post<AuthResponse>(`${this.apiUrl}account/change-password`, data);
  }

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };

    return userDetail;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;
    return true;
  };

  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    //if (isTokenExpired) this.logout();
    return true;
  }

  getRoles = (): string[] | null => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  }

  logout = () => {
    localStorage.removeItem(this.userKey);
  }

  getAll = (): Observable<UserDetail[]> => 
    this.http.get<UserDetail[]>(`${this.apiUrl}account`);

  refreshToken = (data:{
    email:string;
    token:string;
    refreshToken:string;
  }): Observable<AuthResponse> => 
    this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data);

  getToken = (): string | null =>{
    const user = localStorage.getItem(this.userKey);
    if(!user) return null;
    const userDetail:AuthResponse = JSON.parse(user);
    return userDetail.token;
  };

  getRefreshToken = (): string | null =>{
    const user = localStorage.getItem(this.userKey);
    if(!user) return null;
    const userDetail:AuthResponse = JSON.parse(user);
    return userDetail.refreshToken;
  };
}
