import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private storage: SQLiteObject

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.dbConnect();
  }

  // Creación de la BD y tablas
  async dbConnect() {
    await this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'test',
        location: 'default',
      }).then((sqLite: SQLiteObject) => {
        this.storage = sqLite;
        this.createTableStudent();
      })
        .catch((error) => console.log(JSON.stringify(error)));
    });
  }

  private createTableStudent() {
    this.storage.executeSql(`
          CREATE TABLE IF NOT EXISTS student(
            student_email varchar(200) primary key,
            student_password varchar(15) not null
          );
          `, [])
      .then((res) => {
        console.log(JSON.stringify(res) + 'Tabla alumno creada');
      })
      .catch((error) => console.log(JSON.stringify(error)) + 'Error en tabla alumno');
  }
}
