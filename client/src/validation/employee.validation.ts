import * as Yup from "yup";

export const employeeSchema = Yup.object({
  full_name: Yup.string()
    .min(3, "Too short")
    .required("Full name is required"),

  email_address: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  department: Yup.string().required("Department is required"),
});

