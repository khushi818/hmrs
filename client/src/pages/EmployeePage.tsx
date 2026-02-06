import { useEffect, useState } from "react";
import EmployeeFormModal from "../components/EmployeeModal";
import { deleteEmployee, getEmployees } from "../api/employee.api";
import '../styles/employeePage.css';

export default function EmployeesPage() {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);


  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data as any);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

   const handleDelete = (id: string) => {
    console.log("Delete employee with ID:", id);
    if (deleteConfirm === id) {
      deleteEmployee(id).then(fetchEmployees);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => {
        setDeleteConfirm(null);
      }, 3000);
    }
  };

  console.log("Employees:", employees);
  return (
   <div className="employees-container">
      {/* Header */}
           <div className="employees-header">
        <div className="header-content">
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            Manage your team members and their information.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-add-employee">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.33333V12.6667M3.33333 8H12.6667"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add Employee
        </button>
      </div>

      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Department</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={4}>
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="24"
                          cy="24"
                          r="23"
                          stroke="#E5E7EB"
                          strokeWidth="2"
                        />
                        <path
                          d="M24 16V24M24 32H24.02"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <h3 className="empty-title">No employees found</h3>
                    <p className="empty-description">
                      Get started by adding your first team member.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="employee-name">
                      <div className="employee-avatar">
                        {emp.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span>{emp.full_name}</span>
                    </div>
                  </td>
                  <td className="email-cell">{emp.email_address}</td>
                  <td>
                    <span className={`department-badge dept-${emp.department.toLowerCase()}`}>
                      {emp.department}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className={`btn-delete ${deleteConfirm === emp.id ? 'confirm' : ''}`}
                      title={deleteConfirm === emp.id ? "Click again to confirm" : "Delete employee"}
                    >
                      {deleteConfirm === emp.id ? (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14 4L6 12L2 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Confirm
                        </>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 4H3.33333H14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <EmployeeFormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );
}
