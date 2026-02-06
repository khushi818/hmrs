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

# @router.get("/employees")
# async def get_all_employees():
#     try: 
#        employees = await db["employees"].find().to_list(length=10)
#        return all__employees_data(employees)
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch employees"
#         )

# @router.post("/employees")
# async def create_employee(payload: Employee):
#     employee = payload.model_dump()
#     employee["email_address"] = employee["email_address"].lower()

#     try:
#         existing_employee = await db["employees"].find_one({
#             "email_address": employee["email_address"]
#         })

#         if existing_employee:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Employee with this email already exists"
#             )

#         result = await db["employees"].insert_one(employee)

#         return {
#             "id": str(result.inserted_id),
#             "message": "Employee created successfully"
#         }

#     except HTTPException:
#         raise  

#     except Exception as e:
#         print(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to create employee"
#         )

# @router.delete("/employees/{employee_id}")
# async def delete_employee(employee_id: str):
#     result = await db["employees"].delete_one({"_id": ObjectId(employee_id)})
#     if result.deleted_count == 1:
#         return {"message": "Employee deleted successfully"}
#     else:
#         raise HTTPException(
#            status_code=status.HTTP_404_NOT_FOUND,
#            detail="Employee not found"
#        )


# @router.post("/attendance")
# async def record_attendance(record: AttendanceRecord):
#     record_dict = record.dict()
#     result = await db["attendance"].insert_one(record_dict)
#     print(result)
#     return {"id": str(result.inserted_id)}

# @router.get("/today-attendance")
# async def get_today_attendance():

#     ist = pytz.timezone("Asia/Kolkata")
#     now_ist = datetime.now(ist)

#     start_ist = now_ist.replace(hour=0, minute=0, second=0, microsecond=0)
#     end_ist = start_ist + timedelta(days=1)

#     start_utc = start_ist.astimezone(pytz.utc)
#     end_utc = end_ist.astimezone(pytz.utc)

#     attendance_records = await db["attendance"].find({
#         "date": {
#             "$gte": start_utc,
#             "$lt": end_utc
#         }
#     }).to_list(length=None)

#     marked_employee_ids = {
#         str(record["employee_id"]) for record in attendance_records
#     }

#     employees = await db["employees"].find().to_list(length=None)

#     marked = []
#     not_marked = []

#     for emp in employees:
#         emp_id = str(emp["_id"])
#         emp_data = {
#             "_id": emp_id,
#             "full_name": emp["full_name"],
#             "department": emp.get("department")
#         }

#         if emp_id in marked_employee_ids:
#             attendance = next(
#                 r for r in attendance_records
#                 if str(r["employee_id"]) == emp_id
#             )

#             emp_data["date"] = attendance["date"].isoformat()
#             emp_data["status"] = attendance.get("status")

#             marked.append(emp_data)
#         else:
#             not_marked.append(emp_data)

#     return {
#         "marked": marked,
#         "not_marked": not_marked
#     }


# @router.get("/attendance/{employee_id}")
# async def get_attendance(employee_id: str):
#     records = await db["attendance"].find({"employee_id": employee_id}).to_list(length=10)
#     return all_attendance_records_data(records)

# app.include_router(router)

