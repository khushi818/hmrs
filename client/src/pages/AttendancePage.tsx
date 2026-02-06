import { useEffect, useState } from 'react';
import { markAttendance, getTodayAttendance } from '../api/attendance.api';
import AttendanceHistoryModal from '../components/AttendanceHistory';
import '../styles/AttendancePage.css';

export default function AttendancePage() {
  const [markedEmployees, setMarkedEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [notMarkedEmployee, setNotMarkedEmployee] = useState<any[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    try {
      const res = await getTodayAttendance();
      setMarkedEmployees(res?.marked || []);
      setNotMarkedEmployee(res?.not_marked || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (empId: string, status: string) => {
    setStatusMap(prev => ({
      ...prev,
      [empId]: status
    }));
  };

  const handleMarkAttendance = async (emp: any) => {
    const status = statusMap[emp.id];
    if (!status) {
      alert('Please select a status first');
      return;
    }

    setMarkingId(emp.id);
    try {
      await markAttendance({ employee_id: emp.id, status });
      await fetchTodayAttendance();
      // Clear the status for this employee
      setStatusMap(prev => {
        const newMap = { ...prev };
        delete newMap[emp.id];
        return newMap;
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setMarkingId(null);
    }
  };

  const totalEmployees = (markedEmployees?.length || 0) + (notMarkedEmployee?.length || 0);
  const presentCount = markedEmployees?.filter(emp => emp.status === 'PRESENT')?.length || 0;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  console.log('Marked Employees:', markedEmployees, notMarkedEmployee);
  return (
    <div className="attendance-page">
      {/* Header */}
      <div className="attendance-header">
        <div className="header-content">
          <h1 className="page-title">Attendance</h1>
          <p className="page-date">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6667 1.33333V4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.33333 1.33333V4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 6.66667H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <button onClick={fetchTodayAttendance} className="btn-refresh" disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.65685 2 11.1569 2.69897 12.2426 3.82843"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 2V4.5H9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon present">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Present</div>
            <div className="stat-value">{presentCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{notMarkedEmployee?.length || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rate">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 13H7L10 21L14 3L17 13H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Attendance Rate</div>
            <div className="stat-value">{attendanceRate}%</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <div className="table-header">
          <h2>Employee Attendance</h2>
          <div className="table-tabs">
            <span className="tab active">
              All ({totalEmployees})
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading attendance data...</p>
          </div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Unmarked Employees */}
              {notMarkedEmployee?.length > 0 && notMarkedEmployee.map(emp => (
                <tr key={emp.id} className="unmarked-row">
                  <td>
                    <div className="employee-name">
                      <div className="employee-avatar pending-avatar">
                        {emp.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span>{emp.full_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`department-badge dept-${emp.department.toLowerCase()}`}>
                      {emp.department}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={statusMap[emp.id] || ""}
                      onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                    >
                      <option value="" disabled>
                        Select status
                      </option>
                      <option value="PRESENT">✓ Present</option>
                      <option value="ABSENT">✗ Absent</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-mark"
                        onClick={() => handleMarkAttendance(emp)}
                        disabled={!statusMap[emp.id] || markingId === emp.id}
                      >
                        {markingId === emp.id ? (
                          <>
                            <div className="btn-spinner"></div>
                            Marking...
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path
                                d="M11.6667 3.5L5.25 9.91667L2.33333 7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Mark
                          </>
                        )}
                      </button>
                      <button
                        className="btn-view"
                        onClick={() => setSelectedEmployee(emp)}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M7 4.66667C8.28866 4.66667 9.33333 5.71134 9.33333 7C9.33333 8.28866 8.28866 9.33333 7 9.33333C5.71134 9.33333 4.66667 8.28866 4.66667 7C4.66667 5.71134 5.71134 4.66667 7 4.66667Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13 7C13 7 10.3333 11.6667 7 11.6667C3.66667 11.6667 1 7 1 7C1 7 3.66667 2.33333 7 2.33333C10.3333 2.33333 13 7 13 7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Marked Employees */}
              {markedEmployees?.length > 0 && markedEmployees.map(emp => (
                <tr key={emp.id} className="marked-row">
                  <td>
                    <div className="employee-name">
                      <div className="employee-avatar marked-avatar">
                        {emp.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span>{emp.full_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`department-badge dept-${emp.department.toLowerCase()}`}>
                      {emp.department}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge status-present">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Present
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedEmployee(emp)}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M7 4.66667C8.28866 4.66667 9.33333 5.71134 9.33333 7C9.33333 8.28866 8.28866 9.33333 7 9.33333C5.71134 9.33333 4.66667 8.28866 4.66667 7C4.66667 5.71134 5.71134 4.66667 7 4.66667Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13 7C13 7 10.3333 11.6667 7 11.6667C3.66667 11.6667 1 7 1 7C1 7 3.66667 2.33333 7 2.33333C10.3333 2.33333 13 7 13 7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        View History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {totalEmployees === 0 && (
                <tr className="empty-row">
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="23" stroke="#E5E7EB" strokeWidth="2" />
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
                        There are no employees to mark attendance for today.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selectedEmployee && (
        <AttendanceHistoryModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}