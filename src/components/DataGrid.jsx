import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Download, Upload } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ExcelImport } from '@/components/ExcelImport';

export const DataGrid = ({ isAdmin }) => {
  const { gridData, updateGridData, lookupData } = useData();
  const [localData, setLocalData] = useState([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalData([...gridData]);
  }, [gridData]);

  const handleCellChange = (rowIndex, field, value) => {
    const newData = [...localData];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    
    // Auto-lookup functionality
    processRowLookups(newData, rowIndex);

    setLocalData(newData);
  };
  
  const processRowLookups = (data, rowIndex) => {
    const row = data[rowIndex];
    let updated = false;

    if (row.productId) {
      const product = lookupData('products', 'id', row.productId);
      if (product) {
        data[rowIndex].productName = product.name;
        if (row.quantity) {
          data[rowIndex].totalPrice = (product.price * parseFloat(row.quantity || 0)).toFixed(2);
        }
        updated = true;
      }
    }

    if (row.customerId) {
      const customer = lookupData('customers', 'id', row.customerId);
      if (customer) {
        data[rowIndex].customerName = customer.name;
        updated = true;
      }
    }

    return updated;
  };

  const addRow = () => {
    const newRow = {
      id: `row_${Date.now()}`,
      productId: '',
      customerId: '',
      quantity: '',
      productName: '',
      customerName: '',
      totalPrice: '',
      notes: ''
    };
    setLocalData([...localData, newRow]);
  };

  const saveData = () => {
    updateGridData(localData);
    toast({
      title: "Data saved!",
      description: "Your grid data has been saved successfully.",
    });
  };
  
  const handleDataImport = (importedData) => {
    const processedData = importedData.map((row, index) => {
      const newRow = { ...row };
      const emptyRow = { productName: '', customerName: '', totalPrice: '' };
      Object.assign(newRow, emptyRow, row);
      processRowLookups(importedData, index);
      return importedData[index];
    });

    setLocalData(processedData);
    toast({
      title: 'Data populated!',
      description: 'The grid has been updated with imported data. Please review and save.',
    });
  };

  const exportData = () => {
    toast({
      title: "🚧 Export feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const importData = () => {
    setIsImportOpen(true);
  };

  const columns = [
    { key: 'productId', label: 'Product ID', width: '120px' },
    { key: 'productName', label: 'Product Name', width: '200px', readonly: true },
    { key: 'customerId', label: 'Customer ID', width: '120px' },
    { key: 'customerName', label: 'Customer Name', width: '200px', readonly: true },
    { key: 'quantity', label: 'Quantity', width: '100px' },
    { key: 'totalPrice', label: 'Total Price', width: '120px', readonly: true },
    { key: 'notes', label: 'Notes', width: '200px' }
  ];

  return (
    <div className="space-y-4">
      <ExcelImport 
        open={isImportOpen} 
        onOpenChange={setIsImportOpen}
        onImport={handleDataImport}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button onClick={addRow} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
          <Button onClick={saveData} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={exportData} variant="outline" size="sm" className="border-slate-600">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {isAdmin && (
            <Button onClick={importData} variant="outline" size="sm" className="border-slate-600">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          )}
        </div>
      </div>

      <div className="border border-slate-600 rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-full">
            <div className="grid grid-header" style={{ gridTemplateColumns: columns.map(col => col.width).join(' ') }}>
              {columns.map((column) => (
                <div key={column.key} className="p-3 text-sm font-semibold border-r border-slate-600 last:border-r-0">
                  {column.label}
                </div>
              ))}
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {localData.map((row, rowIndex) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  className="grid"
                  style={{ gridTemplateColumns: columns.map(col => col.width).join(' ') }}
                >
                  {columns.map((column) => (
                    <div key={column.key} className="grid-cell p-0 border-r border-slate-600 last:border-r-0">
                      <Input
                        value={row[column.key] || ''}
                        onChange={(e) => handleCellChange(rowIndex, column.key, e.target.value)}
                        className="border-0 bg-transparent h-10 rounded-none focus:ring-0 focus:border-0"
                        placeholder={column.readonly ? 'Auto-filled' : ''}
                        readOnly={column.readonly}
                      />
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
        <h3 className="text-sm font-semibold text-white mb-2">💡 Lookup Tips:</h3>
        <ul className="text-xs text-slate-300 space-y-1">
          <li>• Enter Product ID (P001, P002, etc.) to auto-fill product name and calculate total price</li>
          <li>• Enter Customer ID (C001, C002, etc.) to auto-fill customer name</li>
          <li>• Change quantity to automatically recalculate total price</li>
          <li>• Use the database manager (Admin) to add more lookup data</li>
        </ul>
      </div>
    </div>
  );
};