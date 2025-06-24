
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Database } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export const DatabaseManager = () => {
  const { databases, updateDatabases } = useData();
  const [editingItem, setEditingItem] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const tableConfigs = {
    products: {
      title: 'Products Database',
      fields: [
        { key: 'id', label: 'Product ID', type: 'text' },
        { key: 'name', label: 'Product Name', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'price', label: 'Price', type: 'number' },
        { key: 'stock', label: 'Stock', type: 'number' }
      ]
    },
    customers: {
      title: 'Customers Database',
      fields: [
        { key: 'id', label: 'Customer ID', type: 'text' },
        { key: 'name', label: 'Customer Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'city', label: 'City', type: 'text' },
        { key: 'country', label: 'Country', type: 'text' }
      ]
    },
    orders: {
      title: 'Orders Database',
      fields: [
        { key: 'id', label: 'Order ID', type: 'text' },
        { key: 'customerId', label: 'Customer ID', type: 'text' },
        { key: 'productId', label: 'Product ID', type: 'text' },
        { key: 'quantity', label: 'Quantity', type: 'number' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'text' }
      ]
    }
  };

  const handleAddItem = (tableName) => {
    const config = tableConfigs[tableName];
    const newItem = {};
    config.fields.forEach(field => {
      newItem[field.key] = '';
    });
    setEditingItem(newItem);
    setEditingTable(tableName);
    setIsDialogOpen(true);
  };

  const handleEditItem = (tableName, item) => {
    setEditingItem({ ...item });
    setEditingTable(tableName);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (tableName, itemId) => {
    const newDatabases = { ...databases };
    newDatabases[tableName] = newDatabases[tableName].filter(item => item.id !== itemId);
    updateDatabases(newDatabases);
    toast({
      title: "Item deleted",
      description: "The item has been removed from the database.",
    });
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingTable) return;

    const newDatabases = { ...databases };
    const existingIndex = newDatabases[editingTable].findIndex(item => item.id === editingItem.id);

    if (existingIndex >= 0) {
      newDatabases[editingTable][existingIndex] = editingItem;
    } else {
      newDatabases[editingTable].push(editingItem);
    }

    updateDatabases(newDatabases);
    setIsDialogOpen(false);
    setEditingItem(null);
    setEditingTable(null);
    
    toast({
      title: "Item saved",
      description: "The item has been saved to the database.",
    });
  };

  const handleFieldChange = (fieldKey, value) => {
    setEditingItem(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="products" className="data-[state=active]:bg-blue-600">
            Products
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-blue-600">
            Customers
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600">
            Orders
          </TabsTrigger>
        </TabsList>

        {Object.entries(tableConfigs).map(([tableName, config]) => (
          <TabsContent key={tableName} value={tableName} className="mt-6">
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      {config.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Manage {tableName} data for lookup operations
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleAddItem(tableName)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {tableName.slice(0, -1)}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        {config.fields.map(field => (
                          <th key={field.key} className="text-left p-3 text-sm font-semibold text-slate-300">
                            {field.label}
                          </th>
                        ))}
                        <th className="text-left p-3 text-sm font-semibold text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {databases[tableName]?.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-700 hover:bg-slate-800/30"
                        >
                          {config.fields.map(field => (
                            <td key={field.key} className="p-3 text-sm text-white">
                              {item[field.key]}
                            </td>
                          ))}
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditItem(tableName, item)}
                                className="border-slate-600 hover:bg-slate-700"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteItem(tableName, item.id)}
                                className="border-red-600 text-red-400 hover:bg-red-600/20"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-effect border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? 'Edit' : 'Add'} {editingTable?.slice(0, -1)}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {editingItem?.id ? 'Update the item details' : 'Add a new item to the database'}
            </DialogDescription>
          </DialogHeader>
          
          {editingTable && editingItem && (
            <div className="space-y-4">
              {tableConfigs[editingTable].fields.map(field => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    value={editingItem[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
              ))}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveItem}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
