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

export { SignUpForm, PasswordForm }