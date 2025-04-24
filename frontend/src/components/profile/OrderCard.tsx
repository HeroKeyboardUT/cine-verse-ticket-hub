import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Film,
  MapPin,
  ChevronRight,
  Ticket,
  ShoppingBag,
} from "lucide-react";
import { Order } from "@/lib/data_order";
import { format } from "date-fns";

interface OrderCardProps {
  order: Order;
  isPast?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isPast = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-600";
      case "Processing":
        return "bg-blue-600";
      case "Confirmed":
        return "bg-yellow-600";
      case "Cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Order #{order.OrderID.substring(3)}
              </span>
              <Badge className={`${getStatusColor(order.Status)} text-white`}>
                {order.Status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(order.OrderDate), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              {Number(order.TotalPrice).toLocaleString()} VND
            </p>
            <p className="text-xs text-muted-foreground">
              {order.PaymentMethod}
            </p>
          </div>
        </div>

        <div className="p-4">
          {order.MovieTitle ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-24 w-full h-32 sm:h-36 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <img
                  src="https://via.placeholder.com/200x300"
                  alt={order.MovieTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Film className="mr-1.5 h-4 w-4 text-primary" />
                  {order.MovieTitle}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-3">
                  {order.StartTime && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {format(
                          new Date(order.StartTime),
                          "EEEE, MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                  )}
                  {order.StartTime && order.EndTime && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {format(new Date(order.StartTime), "h:mm a")} -
                        {format(new Date(order.EndTime), "h:mm a")}
                      </span>
                    </div>
                  )}
                  {order.CinemaName && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {order.CinemaName} - Room {order.RoomNumber}
                      </span>
                    </div>
                  )}
                  {order.SeatNumber && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Ticket className="h-3.5 w-3.5" />
                      <span>Seat {order.SeatNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.Format && (
                    <Badge variant="outline">{order.Format}</Badge>
                  )}
                  {order.Subtitle && <Badge variant="outline">Subtitled</Badge>}
                  {order.Dub && <Badge variant="outline">Dubbed</Badge>}
                  {order.RoomType && (
                    <Badge variant="outline">{order.RoomType} Room</Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Food & Drinks Order</h3>
                <p className="text-sm text-muted-foreground">
                  Concession stand order
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order actions */}
        <div className="px-4 pb-4 flex justify-end">
          <Button asChild variant="ghost" size="sm">
            <Link
              to={`/profile/orders/${order.OrderID}`}
              className="flex items-center"
            >
              {isPast ? "View Details" : "View Ticket"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
