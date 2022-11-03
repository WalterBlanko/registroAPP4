import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, Form } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController, NavCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  navegationextras: NavCustomEvent;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['correo@duocuc.cl', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    });
  }

  // Función para validar login
  async login() {
    // const loading = await this.loadingCtrl.create();
    // await loading.present();

    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
