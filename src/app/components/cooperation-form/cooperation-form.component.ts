import { Component, OnInit } from '@angular/core';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';

interface IJobOffer {
  title: string;
  description: string;
  date: number;
  id?: string;
}

@Component({
  selector: 'app-cooperation-form',
  templateUrl: './cooperation-form.component.html',
  styleUrls: ['./cooperation-form.component.scss']
})
export class CooperationFormComponent implements OnInit {

  posts: Observable<IJobOffer[]>;

  constructor(private firestoreDAO: FirestoreDaoService) {
  }

  ngOnInit() {
    this.posts = this.firestoreDAO.getJobOffers();
  }

}
