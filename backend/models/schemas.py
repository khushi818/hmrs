def employee_data(employee):
    return {
        "id" : str(employee["_id"]),
        "full_name" : employee["full_name"],
        "email_address" : employee["email_address"],
        "department" : employee["department"],
        "created_at" : employee["created_at"],
        "updated_at" : employee["updated_at"]
    }

def all__employees_data(employees):
    return [employee_data(employee) for employee in employees]

def attendance_record_data(record):
    return {
        "employee_id" : record["employee_id"],
        "date" : record["date"],
        "status" : record["status"]
    }

def all_attendance_records_data(records):
    return [attendance_record_data(record) for record in records]


exports = {
    "employee_data": employee_data,
    "all_employees_data": all__employees_data,
    "attendance_record_data": attendance_record_data
}