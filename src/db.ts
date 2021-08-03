import postgresql from "pg-promise";

const pgp = postgresql();
const cn = {
  user: 'db',
  password: 'uyic0zaoa34tnce7',
  database: 'db',
  host: 'app-eb1fc847-ebd6-493d-8007-1cc02fc437c9-do-user-9387719-0.b.db.ondigitalocean.com',
  port: 25060,
  ssl: {
    rejectUnauthorized: false
  }
}
const db = pgp(cn)

db.connect()
  .then(obj => {
    console.log("Connection to database is established")
  })
  .catch(err => {
    console.log("Database connection attempt failed: ", err);
  })

export default db;