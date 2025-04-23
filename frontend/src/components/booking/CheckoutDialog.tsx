import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Movie } from "@/lib/data_movies";
import { Voucher } from "@/lib/data_voucher";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movie: Movie;
  selectedSeats: string[];
  foodItemsCount: number;
  totalPrice: number;
  paymentMethod: "Credit Card" | "Cash" | "Mobile App";
  setPaymentMethod: (method: "Credit Card" | "Cash" | "Mobile App") => void;
  isProcessing: boolean;
  onConfirm: () => void;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  movie,
  selectedSeats,
  foodItemsCount,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  isProcessing,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Please review your booking details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Movie:</span>
              <span>{movie.title}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Seats:</span>
              <span>{selectedSeats.join(", ")}</span>
            </div>

            {foodItemsCount > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Food & Drinks:</span>
                <span>{foodItemsCount} items</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="font-medium">Total Price:</span>
              <span className="font-bold">
                {totalPrice.toLocaleString()} VND
              </span>
            </div>

            <div className="pt-4">
              <span className="font-medium">Payment Method:</span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={
                    paymentMethod === "Credit Card" ? "default" : "outline"
                  }
                  onClick={() => setPaymentMethod("Credit Card")}
                  className="w-full"
                >
                  Credit Card
                </Button>
                <Button
                  variant={paymentMethod === "Cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("Cash")}
                  className="w-full"
                >
                  Cash
                </Button>
                <Button
                  variant={
                    paymentMethod === "Mobile App" ? "default" : "outline"
                  }
                  onClick={() => setPaymentMethod("Mobile App")}
                  className="w-full"
                >
                  Mobile App
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
