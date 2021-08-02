import express from 'express';

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
