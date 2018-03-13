import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { forEach } from 'lodash';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { SwalObjService } from '../../services/swal-obj.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public map: any = { lat: 50.011750, lng: 20.987523 };

  constructor(private firestoreDAO: FirestoreDaoService, private swalObj: SwalObjService) {
  }

  ngOnInit() {
  }

  submitForm(f: NgForm) {
    const { value } = f;
    const data = Object.assign(value, { type: 'CONTACT' });

    this.firestoreDAO.sendEmail(data).then((result) => {
      f.resetForm();
      const inputs = document.getElementsByTagName('input');
      forEach(inputs, (input) => {
        input.focus();
        input.blur();
      });
      document.querySelector('textarea').focus();
      document.querySelector('textarea').blur();
      this.swalObj.composeDialog('', 'Wiadomość została wysłana', 'success', this.dialogSwal);
    }).catch((err) => {
      this.swalObj.composeDialog('Przykro nam', 'Nie można wysłać wiadomości', 'error', this.dialogSwal);
      console.error(err);
    });
  }
}
