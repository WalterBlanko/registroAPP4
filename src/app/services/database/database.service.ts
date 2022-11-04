import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Student } from 'src/app/models/student';

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

  public addStudent(email, password) {
    this.storage.executeSql('insert into student (student_email, student_password) values ("' + email + '", "' + password + '")', [])
      .then(() => {
        console.log('Registrado con exito');
      }, (error) => {
        console.log('Error al registrar: ' + error.message);
      })
  }

  public getStudents() {
    return this.storage.executeSql("SELECT * FROM student", [])
      .then((data) => {
        let user: Student[] = [];

        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            user.push({
              student_email: data.rows.item(i).student_email,
              student_password: data.rows.item(i).student_password
            });
          }
        }

        return user;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
  }

  public getMail(email): Promise<Student> {
    return this.storage.executeSql('select * from student where student_email = ?', [email])
      .then((res) => {
        return {
          student_email: res.rows.item(0).student_email,
          student_password: res.rows.item(0).student_password
        }
      })
  }
}
