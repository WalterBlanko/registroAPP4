import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/student';
import { Asignature } from 'src/app/models/asignature';
import { SpA } from 'src/app/models/spa';
import { asist } from 'src/app/models/asist';

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
        this.createTables();
      })
        .catch((error) => console.log(JSON.stringify(error)));
    });
  }

  private createTables() {
    this.createTableStudent();
    this.createTableAsignature();
    this.createTableSpa();
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

  private createTableAsignature() {
    this.storage.executeSql(`
      CREATE TABLE IF NOT EXISTS asignature(
        asignature_id varchar(20) primary key,
        asignature_name varchar(60),
        asignature_section varchar(5),
        asignature_modality varchar(1),
        asignature_teacher varchar(200)
      );
    `, [])
      .then((res) => {
        console.log(JSON.stringify(res) + 'Tabla Ramo creada');
      })
      .catch((error) => console.log(JSON.stringify(error)) + 'Error en tabla ramo');
  }

  private createTableSpa() {
    this.storage.executeSql(`
      CREATE TABLE IF NOT EXISTS spa(
        asignature_id varchar(20),
        student_email varchar(200),
        foreign key (asignature_id) references asignature(asignature_id),
        foreign key (student_email) references student(student_email)
      );
    `, [])
      .then((res) => {
        console.log(JSON.stringify(res) + 'Tabla SPA creada');
      })
      .catch((error) => console.log(JSON.stringify(error)) + 'Error en tabla SPA');
  }

  public addStudent(email, password) {
    this.storage.executeSql('insert into student (student_email, student_password) values ("' + email + '", "' + password + '")', [])
      .then(() => {
        console.log('Registrado con exito');
      }, (error) => {
        console.log('Error al registrar: ' + error.message);
      })
  }

  public addAsignature(asignature_id, asignature_name, asignature_section, asignature_modality, asignature_teacher) {
    this.storage.executeSql('insert into asignature (asignature_id, asignature_name, asignature_section, asignature_modality, asignature_teacher) values ("' + asignature_id + '", "' + asignature_name + '", "' + asignature_section + '", "' + asignature_modality + '", "' + asignature_teacher + '")', [])
      .then(() => {
        console.log('Ramo ingresado con exito');
      }, (error) => {
        console.log('Error al ingresar ramo: ' + error.message);
      })
  }

  public addSPA(asignature_id, student_email) {
    this.storage.executeSql('insert into spa (asignature_id, student_email) values ("' + asignature_id + '", "' + student_email + '")', [])
      .then(() => {
        console.log('SPA ingresado');
      }, (error) => {
        console.log('Error al ingresar SPA: ' + error.message);
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

  public getSpA(student_email) {
    return this.storage.executeSql(`
      SELECT
        a.asignature_id,
        a.asignature_name,
        a.asignature_teacher,
        a.asignature_section,
        a.asignature_modality
      FROM spa s JOIN asignature a ON a.asignature_id = s.asignature_id
        JOIN student st ON st.student_email = s.student_email
      WHERE st.student_email = ?
    `, [student_email])
      .then((data) => {
        let asist: asist[] = [];

        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            asist.push({
              asignature_id: data.rows.item(i).asignature_id,
              asignature_name: data.rows.item(i).asignature_name,
              asignature_teacher: data.rows.item(i).asignature_teacher,
              asignature_section: data.rows.item(i).asignature_section,
              asignature_modality: data.rows.item(i).asignature_modality
            });
          }
        }
        return asist;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
  }

  public getAsignatures() {
  return this.storage.executeSql('select * from asignature', [])
    .then((data) => {
      let asignature: Asignature[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          asignature.push({
            asignature_id: data.rows.item(i).asignature_id,
            asignature_name: data.rows.item(i).asignature_name,
            asignature_section: data.rows.item(i).asignature_section,
            asignature_modality: data.rows.item(i).asignature_modality,
            asignature_teacher: data.rows.item(i).asignature_teacher
          });
        }
      }
      return asignature;
    }, err => {
      console.log('Error: ', err);
      return [];
    })
}

  public getMail(email): Promise < Student > {
  return this.storage.executeSql('select * from student where student_email = ?', [email])
    .then((res) => {
      return {
        student_email: res.rows.item(0).student_email,
        student_password: res.rows.item(0).student_password
      }
    })
}

  public updateUser(email, password) {
  return this.storage.executeSql(`update student set student_password = '${password}' where student_email = '${email}'`)
    .then(data => {
      console.log(data + ' Cambio de contraseña exitoso');
    })
    .catch((error) => {
      console.log(error + ' ' + email + ' ' + password)
    });
}
}
