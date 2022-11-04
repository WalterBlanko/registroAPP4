import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, Form } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { ApiDuocService } from 'src/app/services/api_duoc/api-duoc.service';
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
    private api: ApiDuocService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
    });

    this.addStudents();
  }

  // Función para validar login
  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    let email = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;

    var loginData = {
      "email": email,
      "password": password
    }

    if(!this.auth.login(email, password)) {
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
          data : loginData
        }
      }
      await loading.dismiss();
      this.router.navigate(['/tabs'], this.navegationextras);
    }
  }

  // Función que obtiene los datos de api db.json y los ingresa a la BD 
  async addStudents() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.api.getStudents().subscribe( async (data: {}) => {
      this.students = data;
      for (let i = 0; i < this.students.length; i++) {
        let e = this.students[i].id;
        let p = this.students[i].password;
        this.db.addStudent(e, p);
        await loading.dismiss();
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
