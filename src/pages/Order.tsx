import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coffee,
  Wine,
  UtensilsCrossed,
  Cake,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  nameAr?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
}

const Order = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  const menuItems: MenuItem[] = [
    // Hot Drinks
    { id: "1", name: "Mint Tea", nameAr: "شاي بالنعناع", price: 10, category: "hot" },
    { id: "2", name: "Coffee", nameAr: "قهوة", price: 15, category: "hot" },
    { id: "3", name: "Espresso", nameAr: "إسبريسو", price: 12, category: "hot" },
    { id: "4", name: "Cappuccino", nameAr: "كابتشينو", price: 20, category: "hot" },
    
    // Cold Drinks
    { id: "5", name: "Fresh Orange Juice", nameAr: "عصير برتقال طبيعي", price: 25, category: "cold" },
    { id: "6", name: "Avocado Smoothie", nameAr: "عصير الأفوكادو", price: 30, category: "cold" },
    { id: "7", name: "Iced Coffee", nameAr: "قهوة مثلجة", price: 22, category: "cold" },
    { id: "8", name: "Mint Lemonade", nameAr: "ليمونادة بالنعناع", price: 18, category: "cold" },
    
    // Moroccan Dishes
    { id: "9", name: "Tagine", nameAr: "طاجين", price: 65, category: "food" },
    { id: "10", name: "Couscous", nameAr: "كسكس", price: 70, category: "food" },
    { id: "11", name: "Harira Soup", nameAr: "حريرة", price: 20, category: "food" },
    { id: "12", name: "Moroccan Salad", nameAr: "سلطة مغربية", price: 25, category: "food" },
    
    // Desserts
    { id: "13", name: "Baklava", nameAr: "بقلاوة", price: 15, category: "dessert" },
    { id: "14", name: "Chebakia", nameAr: "شباكية", price: 12, category: "dessert" },
    { id: "15", name: "Sellou", nameAr: "سلو", price: 18, category: "dessert" },
    { id: "16", name: "Moroccan Cookies", nameAr: "حلويات مغربية", price: 20, category: "dessert" },
  ];

  const addToOrder = (item: MenuItem) => {
    const existing = orderItems.find(i => i.id === item.id);
    if (existing) {
      setOrderItems(orderItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    toast.success("Item removed");
  };

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to order");
      return;
    }
    navigate(`/checkout/${tableId}`, { state: { orderItems, total } });
  };

  const handleSendToKitchen = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to order");
      return;
    }
    toast.success("Order sent to kitchen!");
    // In production, would send to backend/kitchen display
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hot": return <Coffee className="h-5 w-5" />;
      case "cold": return <Wine className="h-5 w-5" />;
      case "food": return <UtensilsCrossed className="h-5 w-5" />;
      case "dessert": return <Cake className="h-5 w-5" />;
      default: return null;
    }
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
              <h1 className="text-2xl font-bold">
                {tableId === "takeaway" ? "Take Away Order" : `Table ${tableId}`}
              </h1>
              <p className="text-sm text-muted-foreground">New Order</p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2 font-bold">
            Total: {total} DH
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="hot" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
                <TabsTrigger value="hot" className="flex flex-col gap-1 py-3 data-[state=active]:bg-gradient-warm data-[state=active]:text-primary-foreground">
                  <Coffee className="h-5 w-5" />
                  <span className="text-xs">Hot Drinks</span>
                </TabsTrigger>
                <TabsTrigger value="cold" className="flex flex-col gap-1 py-3 data-[state=active]:bg-gradient-mint data-[state=active]:text-secondary-foreground">
                  <Wine className="h-5 w-5" />
                  <span className="text-xs">Cold Drinks</span>
                </TabsTrigger>
                <TabsTrigger value="food" className="flex flex-col gap-1 py-3 data-[state=active]:bg-gradient-warm data-[state=active]:text-primary-foreground">
                  <UtensilsCrossed className="h-5 w-5" />
                  <span className="text-xs">Food</span>
                </TabsTrigger>
                <TabsTrigger value="dessert" className="flex flex-col gap-1 py-3 data-[state=active]:bg-gradient-mint data-[state=active]:text-secondary-foreground">
                  <Cake className="h-5 w-5" />
                  <span className="text-xs">Desserts</span>
                </TabsTrigger>
              </TabsList>

              {["hot", "cold", "food", "dessert"].map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {menuItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <Card
                          key={item.id}
                          className="shadow-card hover:shadow-elevated transition-all cursor-pointer active:scale-95"
                          onClick={() => addToOrder(item)}
                        >
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              {getCategoryIcon(item.category)}
                              <span className="text-lg font-bold text-primary">{item.price} DH</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-base">{item.name}</h3>
                              {item.nameAr && (
                                <p className="text-sm text-muted-foreground" dir="rtl">{item.nameAr}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Order Summary Section */}
          <div className="space-y-4">
            <Card className="shadow-card sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold border-b border-border pb-3">Order Summary</h2>
                
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No items added yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-start justify-between gap-2 p-3 rounded-lg bg-muted/30">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.price} DH</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">{total} DH</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="touch"
                        size="touch"
                        className="w-full"
                        onClick={handleCheckout}
                      >
                        <Receipt className="mr-2 h-5 w-5" />
                        Checkout
                      </Button>
                      <Button
                        variant="secondary"
                        size="touch"
                        className="w-full"
                        onClick={handleSendToKitchen}
                      >
                        <Check className="mr-2 h-5 w-5" />
                        Send to Kitchen
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
