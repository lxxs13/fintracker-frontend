import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ILoginDTO } from '../../../../models/DTOS/ILoginDTO';
import { ILoginResponse } from '../../../../models/responses/ILoginResponse';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'fintracker-login-component',
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
})
export class Login {
  @Output() goToRegister: EventEmitter<number> = new EventEmitter<number>();

  private _formBuilder = inject(FormBuilder)
  private _authService = inject(AuthService);
  private _router = inject(Router);

  formGroupLogin!: FormGroup;

  formSubmitted = false;
  isLoginInProcess: boolean = false;
  showLoginError: boolean = false;

  errorMessage: string = '';

  ngOnInit(): void {
    localStorage.clear();

    this.formGroupLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.showLoginError = false;
    this.isLoginInProcess = true;
    this.formSubmitted = true;
    this.formGroupLogin.clearValidators();
    this.formGroupLogin.disable();

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

    this._authService.login(loginData).subscribe({
      next: (response: ILoginResponse) => {
        this.formSubmitted = false;

        const { userFullName, accessToken, expiresIn } = response;

        localStorage.setItem('userName', userFullName);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('expiresIn', expiresIn.toString());

        this.isLoginInProcess = false;
        this._router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.showLoginError = true;
        this.formGroupLogin.enable();
        this.isLoginInProcess = false;
      }
    })
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.formGroupLogin.get(controlName);

    return !!(control && control?.invalid && (control.dirty || control.touched));
  }

  goToRegistarPage(): void {
    this.goToRegister.emit(1);
  }

}
