// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAgCpK3viTILdruWZjdibBR5B0lYXMEStA",
    authDomain: "courtside-c72c4.firebaseapp.com",
    databaseURL: "https://courtside-c72c4.firebaseio.com",
    projectId: "courtside-c72c4",
    storageBucket: "courtside-c72c4.appspot.com",
    messagingSenderId: "407528611379",
    appId: "1:407528611379:web:09d5884fc2d2f0e150cd46"
  }
}

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
