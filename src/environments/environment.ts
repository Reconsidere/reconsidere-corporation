// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  auth: true,
  database: {
    description: 'Eowyn Reconsidere Corporation Development Mongo DataBase',
    username: 'reconsidere-corporation',
    password: '',
    host: '',
    port: '27017',
    dbname: 'reconsideredb',
    uri: `http://localhost:32546/corporation`
  },
  api: {
    auth: {
      uri: `localhost:32546`
    },
    persistence: {
      uri: `localhost:32546`
    },
    publish: {
      uri: `localhost:32546`
    },
    external: {
      uri: `localhost:32546`
    },
    uri: "localhost:32546"
  },
  secret: '154097$#@$^@1ETI',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
