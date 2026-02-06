import { Formik, Form, Field, ErrorMessage } from "formik";
import Modal from "./Modal";
import { employeeSchema } from "../validation/employee.validation";
import { createEmployee } from "../api/employee.api";
import '../styles/EmployeeModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialValues = {
  full_name: "",
  email_address: "",
  department: "",
};

export default function EmployeeFormModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Employee">
      <Formik
        initialValues={initialValues}
        validationSchema={employeeSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            await createEmployee(values);
            resetForm();
            onSuccess?.();
            onClose();
           
          } catch (err) {
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
      <Form className="employee-form">
            {/* Full Name */}
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <Field
                name="full_name"
                placeholder=""
                className="form-input"
              />
              <ErrorMessage
                name="full_name"
                component="div"
                className="form-error"
              />
            </div>

            {/* Email */}
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <Field
                name="email_address"
                type="email"
                placeholder=""
                className="form-input"
              />
              <ErrorMessage
                name="email_address"
                component="div"
                className="form-error"
              />
            </div>

            {/* Department */}
            <div className="form-field">
              <label className="form-label">Department</label>
              <Field as="select" name="department" className="form-select">
                <option value="">Select a department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </Field>
              <ErrorMessage
                name="department"
                component="div"
                className="form-error"
              />
            </div>

            {/* Footer */}
            <div className="form-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-submit ${isSubmitting ? 'submitting' : ''}`}
              >
                Add Employee
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}


