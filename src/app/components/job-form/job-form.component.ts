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
  public firstName: FormControl;
  public lastName: FormControl;
  public address: FormControl;
  public phone: FormControl;
  public email: FormControl;
  public position: FormControl;
  public message: FormControl;

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
      console.log(params);
    });
  }

  createControls() {
    this.firstName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.lastName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.address = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.phone = new FormControl('', [Validators.required, Validators.minLength(9)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.position = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.message = new FormControl('');
  }

  createForm() {
    this.createControls();

    this.jobForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      phone: this.phone,
      email: this.email,
      position: this.position,
      message: this.message
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

  errorMsg(property) {
    const required = property.errors.minlength.requiredLength;
    const actual = property.errors.minlength.actualLength;
    return `Password must be ${required} characters long, we need another
     ${required - actual} characters `;
  }

  submitForm(f: NgForm) {
    console.log(this.jobForm);
    const { value, valid } = this.jobForm;

    if (valid) {
      this.isSending = true;
      const data = Object.assign(value, { type: 'JOB', attachments: this.fileToUpload });

      console.log(this.fileToUpload);

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
