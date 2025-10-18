import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Printer,
  CheckCircle2,
  Percent,
} from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderItems = [], total = 0 } = location.state || {};
  
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(null);

  const finalTotal = total - discount;

  const applyDiscount = (percentage: number) => {
    const discountAmount = Math.round(total * (percentage / 100));
    setDiscount(discountAmount);
    toast.success(`${percentage}% discount applied`);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Simulate payment processing
    toast.success("Processing payment...");
    
    setTimeout(() => {
      toast.success("Payment successful!");
      navigate("/dashboard");
    }, 1500);
  };

  const handlePrintReceipt = () => {
    toast.success("Printing receipt...");
    // In production, would trigger actual printer
  };

  if (!orderItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-card">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">No order found</p>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-sm text-muted-foreground">Complete Payment</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {item.price} DH
                      </p>
                    </div>
                    <p className="font-bold">{item.quantity * item.price} DH</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{total} DH</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-pos-success">
                    <span>Discount:</span>
                    <span className="font-semibold">-{discount} DH</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t border-border pt-2">
                  <span>Total:</span>
                  <span className="text-primary">{finalTotal} DH</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <div className="space-y-4">
            {/* Discount Options */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Apply Discount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 15, 20].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="touch"
                      onClick={() => applyDiscount(percent)}
                      disabled={discount > 0}
                    >
                      {percent}%
                    </Button>
                  ))}
                  {discount > 0 && (
                    <Button
                      variant="ghost"
                      size="touch"
                      onClick={() => setDiscount(0)}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  size="touch"
                  className="w-full"
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote className="mr-2 h-5 w-5" />
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  size="touch"
                  className="w-full"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Card
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="touch"
                size="touch"
                className="w-full"
                onClick={handlePayment}
                disabled={!paymentMethod}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Complete Payment ({finalTotal} DH)
              </Button>
              <Button
                variant="secondary"
                size="touch"
                className="w-full"
                onClick={handlePrintReceipt}
              >
                <Printer className="mr-2 h-5 w-5" />
                Print Receipt
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
