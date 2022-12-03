import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

import { DatabaseService } from './services/database/database.service';
import { ApiDuocService } from './services/api_duoc/api-duoc.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  students: any = [];
  asignature: any = [];
  spa: any = [];

  // Coordenadas 
  lat1: number;
  long1: number;
  distance: number;

  // Coordenadas de la sede A.V
  lat2: number = -33.433012;
  long2: number = -70.614847;

  constructor(
    private db: DatabaseService,
    private api: ApiDuocService,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private alertCtrl: AlertController,

    public alertController: AlertController
  ) {
  }

  ngOnInit() {
    this.addElements();
  }

  // Función que obtiene los datos de api db.json y los ingresa a la BD, en conjunto de la obtención de la posición y calculo de distancia 
  async addElements() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    try {
      this.addStudents();
      this.addAsignatures();
      this.addSPA();
      this.getPosition();
      await loading.dismiss();
    } catch (error) {
      // console.log(error.message);
      await loading.dismiss();
    }
  }

  addStudents() {
    this.api.getStudents().subscribe((data: {}) => {
      this.students = data;
      for (let i = 0; i < this.students.length; i++) {
        let e = this.students[i].id;
        let p = this.students[i].password;
        this.db.addStudent(e, p);
      }
    });
  }

  addAsignatures() {
    this.api.getAsignatures().subscribe((data: {}) => {
      this.asignature = data;
      for (let index = 0; index < this.asignature.length; index++) {
        let i = this.asignature[index].id;
        let n = this.asignature[index].name;
        let s = this.asignature[index].section;
        let m = this.asignature[index].modality;
        let t = this.asignature[index].teacher;
        this.db.addAsignature(i, n, s, m, t);
      }
    });
  }

  addSPA() {
    this.api.getSPA().subscribe((data: {}) => {
      this.spa = data;
      // console.log(this.spa);
      for (let index = 0; index < this.spa.length; index++) {
        let ai = this.spa[index].id;
        let se = this.spa[index].student_email;
        this.db.addSPA(ai, se);
      }
    });
  }

  // Función para obtener coordenadas GPS
  getPosition() {
    this.geolocation.getCurrentPosition().then((res) => {
      this.lat1 = res.coords.latitude;
      this.long1 = res.coords.longitude;

      this.distance = this.calculator();

      if (this.distance > 0.1) {
        this.showExitConfirm();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  // Función que calcula la distancia entre el punto A y la sede A.V
  calculator() {
    var degtorad = 0.01745329;
    var radtodeg = 57.29577951;
    var lat1 = this.lat1;
    var lat2 = this.lat2;
    var long1 = this.long1;
    var long2 = this.long2;

    var dlong = (long1 - long2);

    var dvalue = (Math.sin(lat1 * degtorad) * Math.sin(lat2 * degtorad)) + (Math.cos(lat1 * degtorad) * Math.cos(lat2 * degtorad) * Math.cos(dlong * degtorad));
    var dd = Math.acos(dvalue) * radtodeg;
    var miles = (dd * 69.16);
    miles = (miles * 100) / 100;
    var km = (dd * 111.302);
    km = Math.round(km * 100) / 100;

    return km;
  }

  showExitConfirm() {
    this.alertCtrl.create({
      header: `Estás a ${this.distance} km de la sede.`,
      message: 'Debe cerrar la aplicación.',
      backdropDismiss: false,
      buttons: [{
        text: 'Salir',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

}
