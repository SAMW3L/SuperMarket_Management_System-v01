import React from 'react';
import { User, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.role}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              employee.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {employee.status}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-2" />
            {employee.email}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="h-4 w-4 mr-2" />
            {employee.phone}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {employee.address}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Joined {new Date(employee.joinDate).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(employee)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(employee.id)}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}