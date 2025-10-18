import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Coffee,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

interface KitchenOrder {
  id: string;
  tableNumber: string;
  items: { name: string; quantity: number; notes?: string }[];
  time: string;
  status: "pending" | "preparing" | "ready";
  duration: number; // in minutes
}

const Kitchen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: "1",
      tableNumber: "Table 1",
      items: [
        { name: "Tagine", quantity: 2 },
        { name: "Mint Tea", quantity: 2, notes: "No sugar" },
      ],
      time: "14:25",
      status: "preparing",
      duration: 15,
    },
    {
      id: "2",
      tableNumber: "Table 3",
      items: [
        { name: "Couscous", quantity: 1 },
        { name: "Moroccan Salad", quantity: 1 },
        { name: "Fresh Orange Juice", quantity: 1 },
      ],
      time: "14:32",
      status: "pending",
      duration: 5,
    },
    {
      id: "3",
      tableNumber: "Take Away",
      items: [
        { name: "Harira Soup", quantity: 3 },
        { name: "Baklava", quantity: 2 },
      ],
      time: "14:35",
      status: "pending",
      duration: 2,
    },
  ]);

  const updateOrderStatus = (orderId: string, status: "preparing" | "ready") => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    toast.success(`Order ${status === "ready" ? "completed" : "started"}`);
  };

  const completeOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    toast.success("Order removed from queue");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-pos-warning/10 text-pos-warning border-pos-warning/20";
      case "preparing":
        return "bg-pos-info/10 text-pos-info border-pos-info/20";
      case "ready":
        return "bg-pos-success/10 text-pos-success border-pos-success/20";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "New Order";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      default:
        return status;
    }
  };

  const getUrgencyClass = (duration: number) => {
    if (duration > 15) return "ring-2 ring-destructive/30";
    if (duration > 10) return "ring-2 ring-pos-warning/30";
    return "";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Kitchen Display</h1>
              <p className="text-sm text-muted-foreground">{orders.length} active orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-base px-4 py-2">
              <Clock className="h-4 w-4 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {orders.length === 0 ? (
          <Card className="shadow-card max-w-md mx-auto">
            <CardContent className="p-12 text-center space-y-4">
              <UtensilsCrossed className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h2 className="text-xl font-bold mb-2">No Active Orders</h2>
                <p className="text-muted-foreground">New orders will appear here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <Card 
                key={order.id} 
                className={`shadow-card hover:shadow-elevated transition-all ${getUrgencyClass(order.duration)}`}
              >
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{order.tableNumber}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{order.time}</span>
                        <span>•</span>
                        <span 
                          className={order.duration > 15 ? "text-destructive font-semibold" : ""}
                        >
                          {order.duration}m ago
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(order.status)}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        {item.name.includes("Tea") || item.name.includes("Coffee") || item.name.includes("Juice") ? (
                          <Coffee className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        ) : (
                          <UtensilsCrossed className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-primary">{item.quantity}×</span>
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          {item.notes && (
                            <div className="flex items-start gap-1 mt-1">
                              <AlertCircle className="h-3 w-3 text-pos-warning flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-pos-warning font-medium">{item.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    {order.status === "pending" && (
                      <Button
                        variant="default"
                        size="touch"
                        className="w-full"
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                      >
                        Start Preparing
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button
                        variant="success"
                        size="touch"
                        className="w-full"
                        onClick={() => updateOrderStatus(order.id, "ready")}
                      >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Mark as Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button
                        variant="success"
                        size="touch"
                        className="w-full"
                        onClick={() => completeOrder(order.id)}
                      >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Order Delivered
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Kitchen;
