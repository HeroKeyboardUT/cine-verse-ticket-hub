
import API_CUSTOMER from "./API_lib/API_CUSTOMER";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  membershipLevel: string;
  registrationDate: string;
  totalSpent: number;
  totalOrders: number;
}

export const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(API_CUSTOMER.GET_CUSTOMERS);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const fetchCustomerById = async (id: string): Promise<Customer> => {
  const url = API_CUSTOMER.GET_CUSTOMER_BY_ID.replace(':id', id);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
};

export const fetchCustomerOrders = async (customerId: string): Promise<any[]> => {
  const url = API_CUSTOMER.GET_CUSTOMER_ORDERS.replace(':id', customerId);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
};

export const createCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  const response = await fetch(API_CUSTOMER.CREATE_CUSTOMER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create customer');
  }
  return response.json();
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<Customer> => {
  const url = API_CUSTOMER.UPDATE_CUSTOMER.replace(':id', id);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update customer');
  }
  return response.json();
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const url = API_CUSTOMER.DELETE_CUSTOMER.replace(':id', id);
  const response = await fetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete customer');
  }
};
