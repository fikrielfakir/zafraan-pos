import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Delete } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleLogin = () => {
    if (pin.length === 4) {
      // Simple demo login - in production would verify against backend
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Please enter a 4-digit PIN");
    }
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md shadow-elevated animate-fade-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="bg-gradient-warm p-4 rounded-2xl shadow-card">
              <Coffee className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Café POS</CardTitle>
          <p className="text-muted-foreground">Enter your PIN to continue</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                  i < pin.length
                    ? "bg-primary border-primary scale-110"
                    : "border-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Number Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="keypad"
                size="keypad"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="keypad"
              size="keypad"
              onClick={handleClear}
            >
              C
            </Button>
            <Button
              variant="keypad"
              size="keypad"
              onClick={() => handleNumberClick("0")}
            >
              0
            </Button>
            <Button
              variant="keypad"
              size="keypad"
              onClick={handleDelete}
            >
              <Delete className="h-5 w-5" />
            </Button>
          </div>

          {/* Login Button */}
          <Button
            variant="touch"
            size="touch"
            className="w-full"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
