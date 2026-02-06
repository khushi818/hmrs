import api from "../config/axiosInstance";

export const markAttendance = (payload: {
  employee_id: string;
  status: "PRESENT" | "ABSENT" ;
}) => api.post("/attendance", payload);

export const getAttendance = (employee_id: string) =>
  api.get(`/attendance/${employee_id}`);

export const getTodayAttendance = () => api.get("/today-attendance");