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

const tlgConfigFormSchema = yup.object().shape({
    chat_id: yup.number().required("Required"),
    description: yup.string().required("Required"),
    minutes: yup.number().required().min(0).max(59).default(0),
    hours: yup.number().required().min(0).max(23).default(0),
    days: yup.number().required().min(0).max(31).default(0),
})

const fbConfigFormSchema = yup.object().shape({
    chat_id: yup.string().required("Required"),
    marker_token: yup.string().required("Required"),
    description: yup.string().required("Required"),
    minutes: yup.number().required().min(0).max(59).default(0),
    hours: yup.number().required().min(0).max(23).default(0),
    days: yup.number().required().min(0).max(31).default(0),
})

const vkConfigFormSchema = yup.object().shape({
    chat_id: yup.number().required("Required"),
    access_token: yup.string().required("Required"),
    description: yup.string().required("Required"),
    minutes: yup.number().required().min(0).max(59).default(0),
    hours: yup.number().required().min(0).max(23).default(0),
    days: yup.number().required().min(0).max(31).default(0),
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

export {signupFormSchema, tlgConfigFormSchema, resetPasswordFormSchema, fbConfigFormSchema, vkConfigFormSchema};