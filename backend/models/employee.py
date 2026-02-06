from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum

class Employee(BaseModel):
    full_name: str
    email_address: EmailStr
    department: str
    created_at: int = datetime.timestamp(datetime.now())
    updated_at: int = datetime.timestamp(datetime.now())

class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"

class AttendanceRecord(BaseModel):
    employee_id: str
    date: int = datetime.timestamp(datetime.now())
    status: AttendanceStatus