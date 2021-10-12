// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  playerPath: "RLV/2021/Players/",
  playerFile: "RLV_Players.json",
  teamPath: "Teams/",
  teamFile: "Teams.json",
  clubPath: "Clubs/",
  clubFile: "Clubs.json",
  clubId: "CYLQZ5LVmk",
  matchPath: "RLV/2021/Matches/",
  matchFile: "RLV_Matches.json",
  gamePath: "RLV/2021/Games/",
  gameFile: "RLV_Games.json",
  statPath: "RLV/2021/Stats/",
  statFile: "RLV_Stats.json",
  pbpPath: "RLV/2021/PBP/",
  pbpFile: "PlaybyPlay.json",
  teamPlayersPath: "RLV/2021/TeamPlayers/",
  teamPlayersFile: "RLV_TeamPlayers.json",
  teamId: "dIV4QF9u9a",
  firebaseConfig: {
    apiKey: "AIzaSyAgCpK3viTILdruWZjdibBR5B0lYXMEStA",
    authDomain: "courtside-c72c4.firebaseapp.com",
    databaseURL: "https://courtside-c72c4.firebaseio.com",
    projectId: "courtside-c72c4",
    storageBucket: "courtsidereports-b2276.appspot.com",
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
