import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SwalObjService } from '../../services/swal-obj.service';
import { forEach } from 'lodash';


@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public fileToUpload: Array<any> = [];
  public sizeSum = null;

  constructor(private route: ActivatedRoute, private firestoreDAO: FirestoreDaoService, private swalObj: SwalObjService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
    });
  }

  async handleFileInput(files: FileList) {
    const wrongFiles = await this.checkFiles(files);
    this.fileToUpload = [];

    if (wrongFiles) {
      this.swalObj.composeDialog(wrongFiles, '', 'error', this.dialogSwal);
    } else {
      this.base64Encode(files).subscribe((item) => {
        this.fileToUpload.push(item);
      });
    }
  }

  checkFiles(files: FileList) {
    this.sizeSum = null;
    let result = null;
    const filesArr = Array.from(files);

    if (filesArr.length > 4) {
      result = 'Można dodać maksymalnie 4 pliki';
    } else {
      let countSize = 0;

      forEach(filesArr, (file) => {
        countSize += file.size + (file.size * 0.33);

        if (file.size > 1024 * 1024) {
          result = 'Plik nie może przekraczać 1 MB !!!';
        }
      });

      if (countSize / 1000000 > 1) {
        this.sizeSum = countSize;
      }
    }

    return Promise.resolve(result);
  }

  base64Encode(files: FileList) {
    const observables = [];

    function encodeFile(file: File) {
      return new Observable((observer) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          observer.next({
            filename: file.name,
            filetype: file.type,
            fileSize: file.size,
            path: reader.result
          });
        };
      });
    }

    Array.from(files).forEach((file) => {
      observables.push(encodeFile(file));
    });

    return Observable.merge(observables).mergeMap(flat => flat);
  }

  submitForm(f: NgForm) {
    const { value } = f;
    const data = Object.assign(value, { type: 'JOB', attachments: this.fileToUpload });

    console.log(this.fileToUpload);

    this.firestoreDAO.sendEmail(data).then((result) => {
      const inputs = document.getElementsByTagName('input');
      this.fileToUpload = [];

      f.resetForm();

      forEach(inputs, (input) => {
        input.focus();
        input.blur();
      });

      this.swalObj.composeDialog('', 'Wiadomość została wysłana', 'success', this.dialogSwal);
    }).catch((err) => {
      const message = 'Nie można wysłać wiadomości. Proszę sprawdzić poprawność plików i danych.';

      this.swalObj.composeDialog('Przykro nam', message, 'error', this.dialogSwal);
      console.error(err);
    });
  }
}
