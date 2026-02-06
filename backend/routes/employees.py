from fastapi import APIRouter
from models.employee import Employee
from models.schemas import all__employees_data
from services.employee_services import (
    get_all_employees,
    create_employee,
    delete_employee
)

router = APIRouter()

@router.get("/")
async def list_employees():
    employees = await get_all_employees()
    return all__employees_data(employees)

@router.post("/")
async def add_employee(payload: Employee):
    employee_id = await create_employee(payload.model_dump())
    return {"id": employee_id}

@router.delete("/{employee_id}")
async def remove_employee(employee_id: str):
    await delete_employee(employee_id)
    return {"message": "Employee deleted"}
