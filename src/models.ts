interface SignUpForm {
  displayName: string,
  email: string,
  phoneNumber: string,
  password: string,
}

interface PasswordForm {
  password: string,
  email: string,
}

interface DrugForm {
  user: string,
  name: string,
  dosage: number,
  interval: number,
  missed: number,
  taken: number,
  repeats: number
}

export { SignUpForm, PasswordForm, DrugForm }