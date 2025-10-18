import { useState } from "react";
import { useNavigate } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Coffee, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Clock,
  ArrowRight,
  LogOut
} from "lucide-react";

type TableStatus = "available" | "occupied" | "reserved";

interface Table {
  id: string;
  number: number;
  status: TableStatus;
  guests?: number;
  orderValue?: number;
  duration?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [tables] = useState<Table[]>([
    { id: "1", number: 1, status: "occupied", guests: 4, orderValue: 245, duration: "25m" },
    { id: "2", number: 2, status: "available" },
    { id: "3", number: 3, status: "occupied", guests: 2, orderValue: 120, duration: "15m" },
    { id: "4", number: 4, status: "available" },
    { id: "5", number: 5, status: "reserved", guests: 6 },
    { id: "6", number: 6, status: "available" },
    { id: "7", number: 7, status: "occupied", guests: 3, orderValue: 180, duration: "40m" },
    { id: "8", number: 8, status: "available" },
  ]);

  const stats = {
    todaySales: 2450,
    activeOrders: 5,
    tablesOccupied: tables.filter(t => t.status === "occupied").length,
    totalTables: tables.length,
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "occupied":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "reserved":
        return "bg-pos-warning/10 text-pos-warning border-pos-warning/20";
      default:
        return "bg-pos-success/10 text-pos-success border-pos-success/20";
    }
  };

  const getStatusLabel = (status: TableStatus) => {
    switch (status) {
      case "occupied":
        return "Occupied";
      case "reserved":
        return "Reserved";
      default:
        return "Available";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-warm p-2 rounded-lg">
              <Coffee className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Café POS</h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Sales</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todaySales} DH</p>
                </div>
                <div className="bg-gradient-warm p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeOrders}</p>
                </div>
                <div className="bg-gradient-mint p-3 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tables</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.tablesOccupied}/{stats.totalTables}
                  </p>
                </div>
                <div className="bg-card border-2 border-primary p-3 rounded-xl">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="touch"
            size="touch"
            className="h-full min-h-[100px]"
            onClick={() => navigate("/order/takeaway")}
          >
            <div className="flex flex-col items-center gap-2">
              <ShoppingBag className="h-8 w-8" />
              <span className="text-base font-bold">New Order</span>
            </div>
          </Button>
        </div>

        {/* Tables Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">Tables</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tables.map((table) => (
              <Card
                key={table.id}
                className={`shadow-card hover:shadow-elevated transition-all cursor-pointer ${
                  table.status === "occupied" ? "ring-2 ring-primary/20" : ""
                }`}
                onClick={() => {
                  if (table.status === "occupied") {
                    navigate(`/order/${table.id}`);
                  } else if (table.status === "available") {
                    navigate(`/order/${table.id}`);
                  }
                }}
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">Table {table.number}</span>
                    <Badge
                      variant="outline"
                      className={getStatusColor(table.status)}
                    >
                      {getStatusLabel(table.status)}
                    </Badge>
                  </div>

                  {table.status === "occupied" && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{table.guests} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{table.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-semibold">
                        <span>Order:</span>
                        <span className="text-primary">{table.orderValue} DH</span>
                      </div>
                    </div>
                  )}

                  {table.status === "reserved" && table.guests && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{table.guests} guests expected</span>
                    </div>
                  )}

                  {table.status === "available" && (
                    <Button variant="outline" size="sm" className="w-full">
                      <span className="flex items-center gap-2">
                        Start Order <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              size="touch"
              onClick={() => navigate("/kitchen")}
            >
              Kitchen Display
            </Button>
            <Button
              variant="outline"
              size="touch"
              onClick={() => navigate("/reports")}
            >
              Sales Report
            </Button>
            <Button
              variant="outline"
              size="touch"
              onClick={() => navigate("/menu")}
            >
              Manage Menu
            </Button>
            <Button
              variant="outline"
              size="touch"
              onClick={() => navigate("/settings")}
            >
              Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
