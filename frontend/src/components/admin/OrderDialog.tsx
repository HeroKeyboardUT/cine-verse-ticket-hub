// @/components/admin/OrderDialog.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO, set } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Order,
  getTicketOrderById,
  getFoodOrderById,
  updateOrderStatus,
  FoodItem,
  TicketItem,
} from "@/lib/data_order";

interface OrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSave?: (order: Order) => void;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  isOpen,
  onOpenChange,
  order,
  onSave,
}) => {
  if (!order) return null;

  const [ticketOrder, setTicketOrder] = React.useState<TicketItem[]>([]);
  const [foodOrder, setFoodOrder] = React.useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchTicketOrder = async () => {
      if (order) {
        const ticketData = await getTicketOrderById(order.OrderID);
        setTicketOrder(ticketData || []);
      }
    };

    const fetchFoodOrder = async () => {
      if (order) {
        const foodData = await getFoodOrderById(order.OrderID);
        setFoodOrder(foodData || []);
      }
    };
    fetchTicketOrder();
    fetchFoodOrder();
  }, [order]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`Order ${order.OrderID} Details`}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 p-4">
          {/* Customer ID */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerId" className="text-right font-semibold">
              Customer ID:
            </Label>
            <div className="col-span-3">{order.CustomerID}</div>
          </div>

          {/* Order Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right font-semibold">
              Order Date:
            </Label>
            <div className="col-span-3">
              {format(parseISO(order.OrderDate), "PPpp")}
            </div>
          </div>

          {/* Tickets */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="tickets" className="text-right font-semibold">
              Tickets:
            </Label>
            <div className="col-span-3">
              {ticketOrder.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {ticketOrder.map((ticket, index) => (
                    <li key={index}>
                      {ticket.showtimeId} - Seat{" "}{ticket.seatNumber}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No tickets</p>
              )}
            </div>
          </div>

          {/* Food Items */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="foodItems" className="text-right font-semibold">
              Food Items:
            </Label>
            <div className="col-span-3">
              { foodOrder.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {foodOrder.map((item, index) => (
                    <li key={index}>
                      {item.itemId} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No food items</p>
              )}
            </div>
          </div>

          {/* Voucher */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voucher" className="text-right font-semibold">
              Voucher:
            </Label>
            <div className="col-span-3">
              {order.VoucherID?order.VoucherID: "No voucher used"}
            </div>
          </div>
          {/* Payment Method */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right font-semibold">
              Payment Method:
            </Label>
          <div className="col-span-3">{order.PaymentMethod}</div>
          </div>

          {/* Total Price */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalPrice" className="text-right font-semibold">
              Total Price:
            </Label>
            <div className="col-span-3">
              {order.TotalPrice.toLocaleString()} VND
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right font-semibold">
              Status:
            </Label>
            <div className="col-span-3">{order.Status}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;