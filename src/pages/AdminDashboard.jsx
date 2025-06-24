import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, Settings, Plus, LayoutGrid } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataGrid } from '@/components/DataGrid';
import { DatabaseManager } from '@/components/DatabaseManager';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AdminDashboard = () => {
  const { databases, gridData } = useData();
  const [activeTab, setActiveTab] = useState('grid');
  
  const getActiveTabFromPath = () => {
    if (window.location.hash.includes('databases')) return 'databases';
    return 'grid';
  }

  const stats = [
    {
      title: 'Total Products',
      value: databases.products?.length || 0,
      icon: Database,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Customers',
      value: databases.customers?.length || 0,
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Total Orders',
      value: databases.orders?.length || 0,
      icon: Settings,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Grid Rows',
      value: gridData?.length || 0,
      icon: LayoutGrid,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-300 mt-1">Oversee all your data from one central hub.</p>
        </motion.div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-white/20 hover:border-white/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-300">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Data Management</CardTitle>
              <CardDescription className="text-slate-300">
                Manage your data grid and databases with advanced lookup capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-blue-600">
                    Data Grid
                  </TabsTrigger>
                  <TabsTrigger value="databases" className="data-[state=active]:bg-blue-600">
                    Databases
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="grid" className="mt-6">
                  <DataGrid isAdmin={true} />
                </TabsContent>
                
                <TabsContent value="databases" className="mt-6">
                  <DatabaseManager />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;