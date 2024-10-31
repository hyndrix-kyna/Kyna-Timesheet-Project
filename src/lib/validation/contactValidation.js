// validation/contactValidation.js
import * as Yup from 'yup';

export const contactValidation = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  contactNo: Yup.string().required('Contact Number is required'),
  emailAddress: Yup.string().email('Invalid email').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
});
