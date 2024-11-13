import React from 'react';
import { Plus, Search } from 'lucide-react';
import { useEmployeeStore } from '../../store/employeeStore';
import EmployeeCard from './EmployeeCard';
import EmployeeForm from './EmployeeForm';
import { Employee } from '../../types';

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployeeStore();
  const [search, setSearch] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | undefined>();

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.role.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    addEmployee(employee);
    setIsFormOpen(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Omit<Employee, 'id'>) => {
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, updatedEmployee);
      setIsFormOpen(false);
      setSelectedEmployee(undefined);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          ))}
          {filteredEmployees.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No employees found
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedEmployee(undefined);
          }}
        />
      )}
    </div>
  );
}