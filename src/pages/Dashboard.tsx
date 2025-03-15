
import { motion } from 'framer-motion';
import { Users, BarChart3, ArrowUp, ArrowDown, DollarSign, CreditCard } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Dashboard
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button>
              <DollarSign className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </motion.div>
        </div>
        
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Stats Cards */}
          {[
            {
              title: "Total Revenue",
              value: "$45,231.89",
              description: "+20.1% from last month",
              icon: DollarSign,
              trend: "up"
            },
            {
              title: "Subscriptions",
              value: "2,350",
              description: "+180.1% from last month",
              icon: Users,
              trend: "up"
            },
            {
              title: "Sales",
              value: "12,234",
              description: "+19% from last month",
              icon: CreditCard,
              trend: "up"
            },
            {
              title: "Active Users",
              value: "573",
              description: "-1.4% from last month",
              icon: Users,
              trend: "down"
            },
          ].map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Activity */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-96">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>
                  Activity for the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary/40" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm mt-2">Connect Supabase to show real data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-96">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-primary/30" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Activity item {item}</p>
                        <p className="text-xs text-muted-foreground">Just now</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
