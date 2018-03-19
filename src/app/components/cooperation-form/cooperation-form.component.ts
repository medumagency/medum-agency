import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { SwalObjService } from '../../services/swal-obj.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { forEach } from 'lodash';
import { CompanyEmailService } from '../../services/company-email.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-cooperation-form',
  templateUrl: './cooperation-form.component.html',
  styleUrls: ['./cooperation-form.component.scss']
})
export class CooperationFormComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public cooperationForm: FormGroup;
  public companyName: FormControl;
  public phone: FormControl;
  public address: FormControl;
  public email: FormControl;

  public fileToUpload: Array<any> = [];
  public isSending = false;

  constructor(private firestoreDAO: FirestoreDaoService,
              private swalObj: SwalObjService,
              private companyEmail: CompanyEmailService) {
  }

  ngOnInit() {
    this.createForm();
  }

  createControls() {
    this.companyName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.phone = new FormControl('', [Validators.required, Validators.minLength(9)]);
    this.address = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
  }

  createForm() {
    this.createControls();

    this.cooperationForm = new FormGroup({
      companyName: this.companyName,
      phone: this.phone,
      address: this.address,
      email: this.email
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

  clearInputs() {
    const inputs = document.getElementsByTagName('input');
    const clearBoxes = input => {
      input.focus();
      input.blur();
    };

    forEach(inputs, clearBoxes);
  }

  submitForm() {
    const { value, valid } = this.cooperationForm;

    if (valid) {
      this.isSending = true;
      const data = Object.assign(value, { type: 'COOPERATION', attachments: this.fileToUpload });

      console.log(this.fileToUpload);

      this.companyEmail.sendEmail(data)
        .then(() => {
          this.isSending = false;
          this.fileToUpload = [];
          this.cooperationForm.reset();
          this.clearInputs();
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
