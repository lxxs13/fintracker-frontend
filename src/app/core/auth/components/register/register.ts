import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth';
import { IRegisterUser } from '../../../../models/DTOS/IRegisterUser';
import { ILoginResponse } from '../../../../models/responses/ILoginResponse';
import { IconColorClassPipe } from "../../../../shared/pipes/icon-color-class-pipe";

@Component({
  selector: 'fintracker-register-component',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    CardModule,
    MessageModule,
    FloatLabelModule,
    DividerModule,
    ButtonModule,
    CommonModule,
    IconColorClassPipe
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  @Output() goToLogin: EventEmitter<number> = new EventEmitter<number>();

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _chgRef = inject(ChangeDetectorRef);
  public route = inject(Router);

  registerFormGroup!: FormGroup;

  isRegisterInProcess: boolean = false;
  successfulRegisterProcess: boolean = false;
  hasError: boolean = false;

  messageError: string = '';
  userfullname: string = '';

  ngOnInit(): void {
    this.registerFormGroup = this._formBuilder.group(
      {
        userfullname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required,]],
        confirmPassword: ['', Validators.required],
      },
      { validators: [this.passwordsMatchValidator] }
    );
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }

    this.isRegisterInProcess = true;
    this.hasError = false;

    const userData: IRegisterUser = {
      userName: this.registerFormGroup.get('userfullname')?.value,
      email: this.registerFormGroup.get('email')?.value,
      password: this.registerFormGroup.get('password')?.value,
    }

    this._authService.register(userData).subscribe({
      next: (response: ILoginResponse) => {
        const { userFullName, accessToken, expiresIn } = response;

        this.isRegisterInProcess = false;
        this.successfulRegisterProcess = true;
        this.hasError = false;

        this.userfullname = userFullName;

        localStorage.setItem('userName', userFullName);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('expiresIn', expiresIn.toString());


        this._chgRef.markForCheck();
      },
      error: (err) => {
        this.isRegisterInProcess = false;
        this.hasError = true;

        this.messageError =
          err.error?.message ||
          err.message ||
          'Ocurrió un error inesperado. Intenta nuevamente.';

        this._chgRef.markForCheck();
      }
    });

  }

  returnLoginPage(): void {
    this.goToLogin.emit(0);
  }


}
