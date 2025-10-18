import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, ArrowRight, Users, TrendingUp, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-elevated animate-fade-in">
        <CardContent className="p-12 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-warm p-6 rounded-3xl shadow-card">
                <Coffee className="h-20 w-20 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              Café POS System
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Modern point of sale system designed for Moroccan restaurants and cafés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <div className="text-center p-4">
              <div className="bg-gradient-mint p-3 rounded-xl inline-flex mb-3">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <p className="text-sm font-medium">Easy to Use</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-gradient-warm p-3 rounded-xl inline-flex mb-3">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium">Track Sales</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-card border-2 border-primary p-3 rounded-xl inline-flex mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Fast Service</p>
            </div>
          </div>

          <Button
            variant="touch"
            size="xl"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Optimized for tablet touch screens • Arabic & French support
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
