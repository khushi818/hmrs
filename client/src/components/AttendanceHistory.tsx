import {  useEffect, useState } from 'react';
import Modal from './Modal';
import { getAttendance } from '../api/attendance.api'


export default function AttendanceHistory({ employee, onClose }: any) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAttendance(employee._id).then((res) => {
        console.log(res)
        setRecords(res)
  }).catch(err => {
    console.error(err)  ;
  })
}, [employee._id]);

  return (
    <Modal isOpen onClose={onClose} title={employee.full_name}>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r: any) => (
            <tr key={r._id}>
              <td>{new Date(r.date * 1000).toDateString()}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
