// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  googleApiKey: 'AIzaSyCI3cZOWTJwV5cQscgy6f9IreTU9XByju0',
  firebase: {
    apiKey: 'AIzaSyDvlBojs5bXECTECcY5Bvn-SbBjn3aji6w',
    authDomain: 'medumcompany-9c02c.firebaseapp.com',
    databaseURL: 'https://medumcompany-9c02c.firebaseio.com',
    projectId: 'medumcompany-9c02c',
    storageBucket: 'medumcompany-9c02c.appspot.com',
    messagingSenderId: '62557819996'
  },
  sendEmail: 'https://us-central1-medumcompany-9c02c.cloudfunctions.net/sendEmaill',
  algolia: {
    apiKey: '5616637fd7e23889b5849bd7c66a6a57',
    appId: '6AD0897I3Y',
    indexName: 'jobOffers',
    urlSync: true
  }
};
