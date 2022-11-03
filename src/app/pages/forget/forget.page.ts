import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, Form } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController, NavCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {
  error: string = "";
  forgetForm: FormGroup;
  navegationextras: NavCustomEvent;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
    this.error = "Las contraseñas no coinciden";
  }

  ngOnInit() {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    }, {
      validator: this.confirmedValidator('password', 'confirm_password')
    });
  }

  // Función que valida que las contraseñas sean iguales (password && confirm_password)
  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  // Función para validar login
  async forget() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
  }

  // Funciones get para con más fácilidad los valores del formulario
  get email() {
    return this.forgetForm.get('email');
  }

  get password() {
    return this.forgetForm.get('password');
  }

  get confirm_password() {
    return this.forgetForm.get('confirm_password');
  }




}
