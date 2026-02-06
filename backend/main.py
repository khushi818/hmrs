from fastapi import FastAPI, APIRouter, HTTPException, status
from models.schemas import all__employees_data, all_attendance_records_data
from db import  get_database
from models.employee import Employee
from models.employee import AttendanceRecord
    

app = FastAPI()
db = get_database()

router = APIRouter()

@router.get("/")
async def health_check():
    return {"status": "ok"}

@router.get("/employees")
async def get_all_employees():
    try: 
       employees = await db["employees"].find().to_list(length=10)
       return all__employees_data(employees)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch employees"
        )

@router.post("/employees")
async def create_employee(payload: Employee):
    print(payload)
    employee = payload.model_dump()
    employee["email_address"] = employee["email_address"].lower()
     
    try:
       existing_employee = await db["employees"].find_one({"email_address": employee["email_address"]})
       
       if existing_employee:
           raise HTTPException(
               status_code=status.HTTP_400_BAD_REQUEST,
               detail="Employee with this email already exists"
           )
       
       result = await db["employees"].insert_one(employee)
       return all__employees_data(result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create employee"
        )

@router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str):
    result = await db["employees"].delete_one({"_id": employee_id})
    if result.deleted_count == 1:
        return {"message": "Employee deleted successfully"}
    else:
        return {"message": "Employee not found"}, 404

@router.post("/attendance")
async def record_attendance(record: AttendanceRecord):
    record_dict = record.dict()
    result = await db["attendance"].insert_one(record_dict)
    print(result)
    return {"id": str(result.inserted_id)}

@router.get("/attendance/{employee_id}")
async def get_attendance(employee_id: str):
    records = await db["attendance"].find({"employee_id": employee_id}).to_list(length=10)
    return all_attendance_records_data(records)

app.include_router(router)

