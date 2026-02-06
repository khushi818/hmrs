import api from "../config/axiosInstance";

export const createEmployee = (payload: {
  full_name: string;
  email_address: string;
  department: string;
}) => api.post("/employees", payload);

export const getEmployees = () => api.get("/employees");

export const deleteEmployee = (id: string) => api.delete(`/employees/${id}`);
