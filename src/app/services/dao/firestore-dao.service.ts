import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireStorage } from 'angularfire2/storage';
import { IJobOffer } from '../../interfaces/jobOffer.interface';

@Injectable()
export class FirestoreDaoService {

  private jobOffersCollection: AngularFirestoreCollection<IJobOffer>;
  private jobOffers: Observable<IJobOffer[]>;

  constructor(private afs: AngularFirestore) {
    this.jobOffersCollection = this.afs.collection('jobOffers');

    this.jobOffers = this.jobOffersCollection.valueChanges();
  }

  getJobOffers() {
    return this.jobOffers;
  }
}
