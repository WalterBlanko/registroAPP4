import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, Form } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, NavCustomEvent } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { Student } from 'src/app/models/student';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {
  error: string = "";
  forgetForm: FormGroup;
  navegationextras: NavCustomEvent;
  private student: Student[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private auth: AuthServiceService,
    private alertCtrl: AlertController,
    private db: DatabaseService
  ) {
    this.error = "Las contraseñas no coinciden";
  }

  ngOnInit() {
    this.forgetForm = this.formBuilder.group({
      email: ['correo@duocuc.cl', [Validators.required, Validators.email]],
      password: ['zeronotsukaima1', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['zeronotsukaima1', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
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

  // Función para validar cambio de contraseña
  async forget() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    let email = this.forgetForm.get('email').value;
    let password = this.forgetForm.get('password').value;

    if(!this.auth.forget(email, password)) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error al cambiar la contraseña',
        message: 'Error en el correo y/o contraseña',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Cambio de contraseña éxitoso',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/login']);
    }
  }

  mostrarUsuarios() {
    console.log('funcionando');
    this.db.getStudents().then(data => {
      this.student = data;
      this.student.forEach(element => {
        console.log(element.student_email + ' ' + element.student_password);
      });
    })
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
