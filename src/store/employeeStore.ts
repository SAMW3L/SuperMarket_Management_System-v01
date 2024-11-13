import { create } from 'zustand';
import { Employee } from '../types';

interface EmployeeState {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Omit<Employee, 'id'>) => void;
  deleteEmployee: (id: string) => void;
  setEmployeeStatus: (id: string, status: 'active' | 'inactive') => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      role: 'Store Manager',
      address: '123 Main St, City',
      joinDate: '2023-01-15',
      status: 'active',
      salary: 65000,
      department: 'Management',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 987-6543',
      role: 'Cashier',
      address: '456 Oak Ave, City',
      joinDate: '2023-03-20',
      status: 'active',
      salary: 35000,
      department: 'Sales',
    },
  ],
  addEmployee: (employee) =>
    set((state) => ({
      employees: [
        ...state.employees,
        { ...employee, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateEmployee: (id, updatedEmployee) =>
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === id ? { ...updatedEmployee, id } : employee
      ),
    })),
  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((employee) => employee.id !== id),
    })),
  setEmployeeStatus: (id, status) =>
    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === id ? { ...employee, status } : employee
      ),
    })),
}));