import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;
import { IEmail } from '../../interfaces/email.interface';

function convertEmailData(data: IEmail): any {
  const fullName = `${data.firstName} ${data.lastName || ''}`;
  let html: string;

  if (data.type === 'JOB') {
    data.subject = 'FORMULARZ ZGŁOSZENIA';
    html = `<h3>Od: ${fullName}</h3>
            <div>Email: ${data.email}</div>
            <div>Adres: ${data.address}</div>
            <dvi>Telefon: ${data.phone}</dvi>
            <div>Stanowisko: ${data.position}</div>
            <div>${data.message}</div>`;
  }
  return {
    type: data.type,
    subject: data.subject,
    html,
    attachments: data.attachments || []
  };
}

@Injectable()
export class FirestoreDaoService {

  private jobOffersCollection: AngularFirestoreCollection<IJobOffer>;
  private emailsCollection: AngularFirestoreCollection<IEmail>;
  private jobOffers: Observable<IJobOffer[]>;
  private jobOfferDoc: AngularFirestoreDocument<IJobOffer>;
  private counterDoc: AngularFirestoreDocument<any>;
  private snapShot: any;

  constructor(private afs: AngularFirestore) {

  }

  getJobOffers(): Observable<IJobOffer[]> {
    this.jobOffersCollection = this.afs.collection('jobOffers', (ref) => {
      return ref.orderBy('date', 'desc');
    });
    // this.jobOffers = this.jobOffersCollection.valueChanges();
    this.snapShot = this.jobOffersCollection.snapshotChanges();

    this.snapShot = this.snapShot.map((arr) => {
      return arr.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    return this.snapShot;
  }

  updateJobOffer(id: string, data: IJobOffer): Promise<void> {
    this.jobOfferDoc = this.afs.doc(`jobOffers/${id}`);
    return this.jobOfferDoc.update(data);
  }

  deleteJobOffer(id: string): Promise<void> {
    this.jobOfferDoc = this.afs.doc(`jobOffers/${id}`);
    return this.jobOfferDoc.delete();
  }

  createJobOffer(data: IJobOffer): Promise<DocumentReference> {
    return this.jobOffersCollection.add(data);
  }

  getCounters(): Observable<any> {
    this.counterDoc = this.afs.doc('offersCounter/Y78hdYlYSpypxyrQV7rX');
    // this.jobOffers = this.jobOffersCollection.valueChanges();

    return this.counterDoc.snapshotChanges().take(1);
  }

  updateCounter(data: any): Promise<void> {
    this.counterDoc = this.afs.doc('offersCounter/Y78hdYlYSpypxyrQV7rX');
    return this.counterDoc.update(data);
  }

  sendEmail(data: IEmail): Promise<DocumentReference> {
    this.emailsCollection = this.afs.collection('emails');

    return this.emailsCollection.add(convertEmailData(data));
  }
}
