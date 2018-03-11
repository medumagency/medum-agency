import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {

  fileToUpload: FileList = null;

  constructor(private route: ActivatedRoute, private firestoreDAO: FirestoreDaoService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files;
    console.log(this.fileToUpload);

    // const attachments = [];
    //
    // console.log(this.fileToUpload);
    // if (this.fileToUpload) {
    //   const data = Array.from(this.fileToUpload);
    //
    //   data.map((file) => {
    //     this.convertFile(file).subscribe((result) => {
    //       console.log(result);
    //       attachments.push({ path: result });
    //     });
    //   });
    //
    // }
  }

  convertFile(fileToRead: File): Observable<MSBaseReader> {
    const base64Observable = new ReplaySubject<MSBaseReader>(10);

    const fileReader = new FileReader();
    fileReader.onload = event => {
      base64Observable.next(fileReader.result);
    };
    fileReader.readAsDataURL(fileToRead);

    return base64Observable;
  }

  submitForm(f: NgForm) {
    const { value } = f;
    const data = Object.assign(value, { type: 'JOB' });


    // this.firestoreDAO.sendEmail(Object.assign(value, { type: 'JOB' })).then((result) => {
    //   console.log(result);
    // }).catch((err) => {
    //   console.log(err);
    // });
  }
}
