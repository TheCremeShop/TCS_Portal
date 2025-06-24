import React from 'react';
import { motion } from 'framer-motion';
import { Table } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGrid } from '@/components/DataGrid';
import DashboardLayout from '@/components/layout/DashboardLayout';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Card className="glass-effect border-white/20">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Table className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h2>
                    <p className="text-slate-300">Start working with your data grid and lookup information from connected databases.</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Table className="w-5 h-5 mr-2" />
                Data Grid
              </CardTitle>
              <CardDescription className="text-slate-300">
                Enter data and use lookup functions to automatically populate information from your databases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataGrid isAdmin={false} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;