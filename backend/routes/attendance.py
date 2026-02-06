from fastapi import APIRouter
from models.employee import AttendanceRecord
from services.attendance_services import (
    get_attendance_history,
    mark_attendance,
    get_today_attendance
)

router = APIRouter()

@router.post("/")
async def create_attendance(payload: AttendanceRecord):
    await mark_attendance(payload.model_dump())
    return {"message": "Attendance marked"}

@router.get("/today")
async def today_attendance():
    return await get_today_attendance()

@router.get("/history/{employee_id}")
async def attendance_history(employee_id: str):
    return await get_attendance_history(employee_id)
