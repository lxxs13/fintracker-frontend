import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Login } from "../../components/login/login";
import { Register } from "../../components/register/register";


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
    Login,
    Register,
],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  formType: number = 0;
}
