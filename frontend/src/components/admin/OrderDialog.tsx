// @/components/admin/MovieDialog.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { parseDuration } from "@/lib/utils";
import {
  Order,
  getOrderById,
  FoodItem,
} from "@/lib/data_order";

interface OrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderID: any;
  onSave?: (order: Order) => void;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  isOpen,
  onOpenChange,
  orderID,
  onSave,
}) => {
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
      const fetchOrder = async () => {
        try {
          const fetchedOrder = await getOrderById(orderID);
          setOrder(fetchedOrder);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch order details.",
            variant: "destructive",
          });
        }
      };
      if (isOpen && orderID) {
        fetchOrder();
      }
    }, [isOpen, orderID]);
    
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
                {`Order ${orderID} Details`}
            </DialogTitle>
          </DialogHeader>

        </DialogContent>
      </Dialog>
    );
};
export default OrderDialog;