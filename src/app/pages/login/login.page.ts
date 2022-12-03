import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, Form } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  navegationextras: NavigationExtras;
  students: any = [];
  

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private auth: AuthServiceService,
    private db: DatabaseService
    
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('correo@duocuc.cl', [Validators.required, Validators.email]),
      password: new FormControl('1234567', [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
    });
  }

  // Función para validar login
  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      duration: 3000,
      spinner: 'lines-small',
    });
    await loading.present();

    let email = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;

    var loginData = {
      "email": email,
      "password": password
    }

    // console.log(email, password);

    this.db.getMail(email).then(async data => {
      let auth = this.auth.login(email, password, data.student_email, data.student_password);

      if (auth == false) {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error al iniciar sesión',
          message: 'Error en el correo y/o contraseña',
          buttons: ['OK']
        });
        await alert.present();
      } else {
        this.navegationextras = {
          state: {
            data: loginData
          }
        }
        // console.log('Iniciando sesión');
        await loading.dismiss();
        this.router.navigate(['/tabs'], this.navegationextras);
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
