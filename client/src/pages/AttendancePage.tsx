import { useEffect, useState } from 'react';
import {  markAttendance , getTodayAttendance} from '../api/attendance.api'
import AttendanceHistoryModal from '../components/AttendanceHistory';


export default function AttendancePage() {
  const [markedemployees, setMarkedEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [notMarkedEmployee, setNotMarkedEmployee] = useState<any>(null);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});


  const fetchTodayAttendance = () => {  
      getTodayAttendance().then(res => {
      setMarkedEmployees(res?.marked);
      setNotMarkedEmployee(res?.not_marked);
    });
  }

  const handleStatusChange = (empId: string, status: string) => {
  setStatusMap(prev => ({
    ...prev,
    [empId]: status
  }));
};


  console.log({markedemployees, notMarkedEmployee})
  useEffect(() => {
      fetchTodayAttendance();
  }, []);

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance</h1>
        <p>{new Date().toDateString()}</p>
      </div>

      <table className="attendance-table">
  <thead>
    <tr>
      <th>Employee</th>
      <th>Department</th>
      <th>Today</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    <>
    {notMarkedEmployee?.length > 0 &&notMarkedEmployee.map(emp => (
      <tr key={emp._id}>
        <td>{emp.full_name}</td>
        <td>{emp.department}</td>

        <td>
      <select
        value={statusMap[emp._id] || ""}
        onChange={(e) => handleStatusChange(emp._id, e.target.value)}
      >
        <option value="" disabled>
          Select status
        </option>
        <option value="PRESENT">Present</option>
        <option value="ABSENT">Absent</option>
      </select>
        </td>

        <td className="actions">
          <button
            onClick={async () => {
              await markAttendance({employee_id: emp._id, status: statusMap[emp._id] || "ABSENT"});
              fetchTodayAttendance(); 
            }}
          >
            Mark
          </button>

          <button onClick={() => setSelectedEmployee(emp)}>
            View
          </button>
        </td>
      </tr>
    ))}
    {markedemployees?.length > 0 && markedemployees.map(emp => (
      <tr key={emp._id}>
        <td>{emp.full_name}</td>
        <td>{emp.department}</td>

        <td>
          <span className="status-present">Present</span>
        </td>

        <td>
          <button onClick={() => setSelectedEmployee(emp)}>
            View
          </button>
        </td>
      </tr>
    ))}
    </>
  </tbody>
</table>


      {selectedEmployee && (
        <AttendanceHistoryModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
