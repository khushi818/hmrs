import { useEffect, useState } from 'react';
import Modal from './Modal';
import { getAttendance } from '../api/attendance.api';
import '../styles/AttendanceHistory.css';

interface AttendanceRecord {
  _id: string;
  date: number;
  status: string;
}

interface Employee {
  _id: string;
  full_name: string;
}

interface AttendanceHistoryProps {
  employee: Employee;
  onClose: () => void;
}

export default function AttendanceHistory({ employee, onClose }: AttendanceHistoryProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAttendance(employee.id)
      .then((res) => {
        console.log(res);
        setRecords(res);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load attendance records');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [employee._id]);

  const getStatusClass = (status: string) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  return (
    <Modal isOpen onClose={onClose} title={`${employee.full_name}'s Attendance`}>
      <div className="attendance-history">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading attendance records...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="empty-state">
            <p>No attendance records found</p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td className="date-cell">
                      {new Date(r.date * 1000).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="status-cell">
                      <span className={getStatusClass(r.status)}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}