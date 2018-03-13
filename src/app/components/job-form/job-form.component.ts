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

  fileToUpload: Array<any> = [];

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
    const filesArr = Array.from(files);
    let result = null;

    if (filesArr.length > 4) {
      result = 'Można dodać maksymalnie 4 pliki';
    } else {
      forEach(filesArr, (file) => {
        if (file.size > 2 * 1024 * 1024) {
          result = 'Pojedynczy plik nie może mieć więcej niż 2 MB!!!';
        }
      });
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
      this.swalObj.composeDialog('Przykro nam', 'Nie można wysłać wiadomości', 'error', this.dialogSwal);
      console.error(err);
    });
  }
}
