import express from 'express';
import { v4 as uuid } from 'uuid';

import firebase from "./firebase";
import db from "./db";
import { DrugForm, PasswordForm, SignUpForm } from './models';

const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: any, res: any) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log('Angiovio listening at port 3000')
})

// db.task(async t => {
//   return await t.any("CREATE TABLE drugs(id UUID PRIMARY KEY, userId text NOT NULL, name text NOT NULL, dosage integer NOT NULL, interval integer NOT NULL, missed integer NOT NULL, taken integer NOT NULL, repeats integer NOT NULL, createdOn text NOT NULL, updatedOn text NOT NULL)")
//     .then(data => {
//       console.log("success");
//     })
// })

// sign up
app.post('/api/signup', async (req: any, res: any) => {
  try {
    const form: SignUpForm = req.body;
    await firebase.auth().createUser(form);
    res.status(200).send('Account created successfully.')
  } catch (error) {
    res.status(500).send(`An unexpected error occurred, ${error}`)
  }
})

// update password
app.post('/api/changepassword', async (req: any, res: any) => {
  try {
    const form: PasswordForm = req.body;
    let uid: string = '';
    await firebase.auth().getUserByEmail(form.email)
      .then((userRecord) => uid = userRecord.uid);
    await firebase.auth().updateUser(uid, {
      password: form.password
    });
    res.status(200).send('Account updated successfully.');
  } catch (error) {
    res.status(500).send(`An unexpected error occurred, ${error}`)
  }
})


// add drug
app.post('/api/adddrug', async (req: any, res: any) => {
  try {
    const form: DrugForm = req.body;
    db.task(async t => {
      return await t.any("INSERT INTO drugs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [uuid(), form.user, form.name, form.dosage, form.interval, form.missed, form.taken, form.repeats, new Date().toString(), ''])
        .then(data => {
          console.log('Insert successful');
          res.status(200).send('Insert successful');
        })
        .catch(error => {
          console.log('failed to insert data', error);
          res.status(500).send('An error occurred, failed to insert data')
        })
    })
  } catch (error) {
    res.status(500).send(`An unexpected error occurred, ${error}`)
  }
})