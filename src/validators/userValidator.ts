import * as yup from "yup";

const userSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  birthdate: yup.date().required(),
  location: yup.string().required(),
});

export { userSchema };
