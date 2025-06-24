
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [databases, setDatabases] = useState({
    products: [],
    customers: [],
    orders: []
  });
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    // Load sample data
    const sampleDatabases = {
      products: [
        { id: 'P001', name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 50 },
        { id: 'P002', name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 200 },
        { id: 'P003', name: 'Office Chair', category: 'Furniture', price: 199.99, stock: 30 },
        { id: 'P004', name: 'Desk Lamp', category: 'Furniture', price: 49.99, stock: 75 }
      ],
      customers: [
        { id: 'C001', name: 'John Smith', email: 'john@example.com', city: 'New York', country: 'USA' },
        { id: 'C002', name: 'Sarah Johnson', email: 'sarah@example.com', city: 'London', country: 'UK' },
        { id: 'C003', name: 'Mike Chen', email: 'mike@example.com', city: 'Tokyo', country: 'Japan' },
        { id: 'C004', name: 'Emma Wilson', email: 'emma@example.com', city: 'Sydney', country: 'Australia' }
      ],
      orders: [
        { id: 'O001', customerId: 'C001', productId: 'P001', quantity: 1, date: '2024-01-15', status: 'Completed' },
        { id: 'O002', customerId: 'C002', productId: 'P002', quantity: 2, date: '2024-01-16', status: 'Processing' },
        { id: 'O003', customerId: 'C003', productId: 'P003', quantity: 1, date: '2024-01-17', status: 'Shipped' },
        { id: 'O004', customerId: 'C004', productId: 'P004', quantity: 3, date: '2024-01-18', status: 'Pending' }
      ]
    };

    const savedDatabases = localStorage.getItem('databases');
    if (savedDatabases) {
      setDatabases(JSON.parse(savedDatabases));
    } else {
      setDatabases(sampleDatabases);
      localStorage.setItem('databases', JSON.stringify(sampleDatabases));
    }

    const savedGridData = localStorage.getItem('gridData');
    if (savedGridData) {
      setGridData(JSON.parse(savedGridData));
    } else {
      // Initialize with sample grid data
      const initialGrid = Array(10).fill(null).map((_, index) => ({
        id: `row_${index}`,
        productId: '',
        customerId: '',
        quantity: '',
        productName: '',
        customerName: '',
        totalPrice: '',
        notes: ''
      }));
      setGridData(initialGrid);
      localStorage.setItem('gridData', JSON.stringify(initialGrid));
    }
  }, []);

  const updateGridData = (newData) => {
    setGridData(newData);
    localStorage.setItem('gridData', JSON.stringify(newData));
  };

  const updateDatabases = (newDatabases) => {
    setDatabases(newDatabases);
    localStorage.setItem('databases', JSON.stringify(newDatabases));
  };

  const lookupData = (table, field, value) => {
    const tableData = databases[table];
    if (!tableData) return null;
    
    return tableData.find(item => item[field] === value);
  };

  const value = {
    databases,
    gridData,
    updateGridData,
    updateDatabases,
    lookupData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
