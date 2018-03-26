import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SwalObjService } from '../../services/swal-obj.service';
import { forEach } from 'lodash';
import { CompanyEmailService } from '../../services/company-email.service';


@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public jobForm: FormGroup;
  public fileToUpload: Array<any> = [];
  public sizeSum = null;
  public isSending = false;

  constructor(private route: ActivatedRoute,
              private firestoreDAO: FirestoreDaoService,
              private swalObj: SwalObjService,
              private companyEmail: CompanyEmailService) {
  }

  ngOnInit() {
    this.createForm();
    this.route.queryParams.subscribe(params => {
      const { position } = params;
      if (position) {
        this.jobForm.patchValue({ position });
      }
    });
  }

  createForm() {
    this.jobForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      address: new FormControl('', [Validators.required, Validators.minLength(5)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      position: new FormControl('', [Validators.required, Validators.minLength(3)]),
      message: new FormControl(''),
      documentPolicy: new FormControl(false, Validators.requiredTrue)
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
    let count = 0;
    const filesArr = Array.from(files);

    if (!filesArr.length) {
      return Promise.resolve(null);
    } else {
      forEach(filesArr, (file) => {
        count += file.size + (file.size * 0.33);
      });
      if (count > 10 * 1024 * 1024) {
        result = 'Łączny rozmiar wszystkich plików nie może przekraczać 10 MB !';
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

  getControl(name: string): any {
    return this.jobForm.controls[name];
  }

  minError(name: string): any {
    const error = this.getControl(name).getError('minlength');
    return {
      required: error.requiredLength,
      actual: error.requiredLength - error.actualLength
    };
  }

  submitForm(f: NgForm) {
    const { value, valid } = this.jobForm;

    if (valid) {
      this.isSending = true;
      const data = Object.assign(value, { type: 'JOB', attachments: this.fileToUpload });

      this.companyEmail.sendEmail(data)
        .then(() => {
          this.isSending = false;
          this.fileToUpload = [];
          f.resetForm();
          this.swalObj.composeDialog('', 'Wiadomość została wysłana', 'success', this.dialogSwal);
        })
        .catch((err) => {
          this.isSending = false;
          const message = 'Nie można wysłać wiadomości. Proszę sprawdzić poprawność plików i danych.';

          this.swalObj.composeDialog('Przykro nam', message, 'error', this.dialogSwal);
          console.error(err);
        });
    }
  }
}
