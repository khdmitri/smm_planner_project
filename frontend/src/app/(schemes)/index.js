import * as yup from 'yup';

const passwordRules = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}/

const signupFormSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid e-mail").required("Required"),
    first_name: yup.string().required("Required"),
    last_name: yup.string().required("Required"),
    password: yup
        .string()
        .min(5)
        .matches(passwordRules, {message: "Make your password stronger"})
        .required("Required"),
    password2: yup
        .string()
        .oneOf([yup.ref('password'), null], "Passwords not matched")
        .required("Required")
})

const resetPasswordFormSchema = yup.object().shape({
    password: yup
        .string()
        .min(5)
        .matches(passwordRules, {message: "Make your password stronger"})
        .required("Required"),
    password2: yup
        .string()
        .oneOf([yup.ref('password'), null], "Passwords not matched")
        .required("Required")
})

export {signupFormSchema, resetPasswordFormSchema};