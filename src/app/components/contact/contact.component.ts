import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { forEach } from 'lodash';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { SwalObjService } from '../../services/swal-obj.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { CompanyEmailService } from '../../services/company-email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public map: any = { lat: 50.000683, lng: 20.969324 };
  public contactForm: FormGroup;
  public isSending = false;

  constructor(private firestoreDAO: FirestoreDaoService,
              private swalObj: SwalObjService,
              private companyEmail: CompanyEmailService) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.contactForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(''),
      subject: new FormControl('', [Validators.required, Validators.minLength(5)]),
      message: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  getControl(name: string): any {
    return this.contactForm.controls[name];
  }

  minError(name: string): any {
    const error = this.getControl(name).getError('minlength');
    return {
      required: error.requiredLength,
      actual: error.requiredLength - error.actualLength
    };
  }

  submitForm(f: NgForm) {
    const { value, valid } = this.contactForm;

    if (valid) {
      this.isSending = true;
      const data = Object.assign(value, { type: 'CONTACT' });

      this.companyEmail.sendEmail(data)
        .then(() => {
          this.isSending = false;
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
