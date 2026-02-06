from datetime import datetime
from routes import attendance, employees
from fastapi import FastAPI, APIRouter, HTTPException, status
from bson import ObjectId
from models.schemas import all__employees_data, all_attendance_records_data
from db import  get_database
from models.employee import Employee
from models.employee import AttendanceRecord
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import pytz
   

app = FastAPI()
db = get_database()

router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@router.get("/")
async def health_check():
    return {"status": "ok"}

app.include_router(employees.router, prefix="/employees", tags=["Employees"])
app.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])

