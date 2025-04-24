import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star, Ticket, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserStatsProps {
  totalOrders: number;
  totalSpent: number;
  membershipLevel: string;
  pointsEarned: number;
}

export const UserStats: React.FC<UserStatsProps> = ({
  totalOrders,
  totalSpent,
  membershipLevel,
  pointsEarned,
}) => {
  // Calculate next tier requirements
  const nextTier = membershipLevel === "Standard" ? "VIP" : "Premium";
  const nextTierThreshold = membershipLevel === "Standard" ? 1000000 : 5000000;
  const progress = Math.min((totalSpent / nextTierThreshold) * 100, 100);
  const remainingForNextTier = Math.max(nextTierThreshold - totalSpent, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Membership Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current level */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Current Level</span>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">
              {membershipLevel}
            </Badge>
          </div>

          {membershipLevel !== "Premium" && (
            <>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span>{membershipLevel}</span>
                <span>{nextTier}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Spend {remainingForNextTier.toLocaleString()} VND more to reach{" "}
                {nextTier}
              </p>
            </>
          )}
        </div>

        <Separator />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="font-medium">{totalOrders}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="font-medium">{totalSpent.toLocaleString()} VND</div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </div>
        </div>

        <Separator />

        {/* Loyalty points */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Loyalty Points</span>
            <span className="font-medium">{pointsEarned} points</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Earn 1 point for every 10,000 VND spent. Redeem points for special
            rewards.
          </p>
          <Button
            variant="outline"
            className="w-full"
            disabled={pointsEarned < 10}
          >
            Redeem Points
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
