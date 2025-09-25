import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { AuthService } from '../../services/auth';
import { ILoginDTO } from '../../../../models/DTOS/ILoginDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fintracker-login',
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    DividerModule,
    MessageModule,
    ButtonModule,
    CardModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage {
  private _formBuilder = inject(FormBuilder)
  private _authService = inject(AuthService);
  private _router = inject(Router);

  formGroupLogin!: FormGroup;

  formSubmitted = false;
  isLoginInProcess: boolean = false;

  ngOnInit(): void {
    this.formGroupLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.isLoginInProcess = true;
    this.formSubmitted = true;
    this.formGroupLogin.clearValidators();

    if (this.formGroupLogin.invalid) {
      this.formGroupLogin.markAllAsDirty();
      this.formSubmitted = false;
      this.isLoginInProcess = false;

      return;
    }

    const loginData: ILoginDTO = {
      email: this.formGroupLogin.get('email')!.value,
      password: this.formGroupLogin.get('password')!.value,
    };

    localStorage.setItem('userName', 'Luis Quiroz Schlemm');

    setTimeout(() => this._router.navigateByUrl('/dashboard'), 1500);

    // this._authService.login(loginData).subscribe({
    //   next: (response: ILoginResponse) => {
    //     this.formSubmitted = false;

    //     const { userName, token, role } = response;



    //     this.isLoginInProcess = false;

    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.isLoginInProcess = false;
    //   }
    // })
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.formGroupLogin.get(controlName);

    return !!(control && control?.invalid && (control.dirty || control.touched));
  }
}
