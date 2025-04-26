// @/components/admin/OrderDialog.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
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
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  isOpen,
  onOpenChange,
  order,
}) => {
  if (!order) return null;

  const [ticketOrder, setTicketOrder] = useState<TicketItem[]>([]);
  const [foodOrder, setFoodOrder] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState(order.Status);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (order) {
        setIsLoading(true);
        const [ticketData, foodData] = await Promise.all([
          getTicketOrderById(order.OrderID),
          getFoodOrderById(order.OrderID),
        ]);
        setTicketOrder(ticketData || []);
        setFoodOrder(foodData || []);
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order]);

  // Xác định các trạng thái có thể chuyển sang dựa trên trạng thái hiện tại
  const getAvailableStatuses = (currentStatus: string) => {
    switch (currentStatus.toLowerCase()) {
      case "booked":
        return ["Processing", "Cancelled"];
      case "processing":
        return ["Success", "Cancelled"];
      case "pending":
        return ["Cancelled"];
      case "cancelled":
      case "success":
        return [];
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(order.Status);

  const handleStatusUpdate = async () => {
    if (newStatus === order.Status) {
      toast({
        title: "No Change",
        description: "The status is already set to this value.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateOrderStatus(order.OrderID, newStatus);
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      order.Status = newStatus;
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`Order ${order.OrderID} Details`}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <p>Loading...</p>
          </div>
        ) : (
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
                        Showtime ID: {ticket.showtimeId} - Seat {ticket.seatNumber}
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
                Food and Drinks:
              </Label>
              <div className="col-span-3">
                {foodOrder.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {foodOrder.map((item, index) => (
                      <li key={index}>
                        Item ID: {item.itemId} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No item</p>
                )}
              </div>
            </div>

            {/* Voucher */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="voucher" className="text-right font-semibold">
                Voucher:
              </Label>
              <div className="col-span-3">
                {order.VoucherID ? order.VoucherID : "No voucher used"}
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
                {order.TotalPrice? order.TotalPrice.toLocaleString() : 0} VND
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right font-semibold">
                Status:
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                  disabled={availableStatuses.length === 0 || isUpdating}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={order.Status}>{order.Status}</SelectItem>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === order.Status || isUpdating}
                  className="ml-2"
                >
                  {isUpdating ? "Updating..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;