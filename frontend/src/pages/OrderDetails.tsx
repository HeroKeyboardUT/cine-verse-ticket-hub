import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Film,
  Ticket,
  CreditCard,
  Download,
  Share2,
  RefreshCw,
  Clipboard,
  Check,
  ShoppingBag,
  Gift,
} from "lucide-react";
import { getOrderById, Order } from "@/lib/data_order";
import { format } from "date-fns";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCopied, setQrCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "Failed to load order details",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, toast]);

  const handleCopyTicketCode = () => {
    if (!order) return;

    navigator.clipboard.writeText(order.OrderID);
    setQrCopied(true);

    toast({
      title: "Ticket code copied",
      description: "Ticket code has been copied to clipboard",
    });

    setTimeout(() => setQrCopied(false), 3000);
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to orders
          </Button>
          <Skeleton className="h-8 w-64 mb-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg mb-6" />
          </div>
          <div>
            <Skeleton className="h-[200px] w-full rounded-lg mb-6" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <p className="mb-6 text-muted-foreground">
          The order you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Button asChild>
          <Link to="/profile">Back to Profile</Link>
        </Button>
      </div>
    );
  }
  console.log(order);
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate("/profile")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to profile
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Order #{order.OrderID.substring(3)}
          </h1>
          <p className="text-muted-foreground">
            Placed on{" "}
            {format(new Date(order.OrderDate), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <Badge
          className={`${getStatusColor(order.Status)} px-3 py-1.5 text-white`}
        >
          {order.Status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Movie & Ticket Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Film className="mr-2 h-5 w-5" /> Movie & Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.MovieTitle ? (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-48 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src="https://via.placeholder.com/300x450"
                      alt={order.MovieTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{order.MovieTitle}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{order.Format}</Badge>
                        {order.Subtitle && (
                          <Badge variant="outline">Subtitled</Badge>
                        )}
                        {order.Dub && <Badge variant="outline">Dubbed</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {order.StartTime &&
                            format(
                              new Date(order.StartTime),
                              "EEEE, MMMM d, yyyy"
                            )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          {order.StartTime &&
                            format(new Date(order.StartTime), "h:mm a")}{" "}
                          -
                          {order.EndTime &&
                            format(new Date(order.EndTime), "h:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>
                          {order.CinemaName} - Room {order.RoomNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        <span>Seat {order.SeatNumber}</span>
                      </div>
                    </div>

                    {order.RoomType && (
                      <div className="pt-2">
                        <Badge variant="secondary">{order.RoomType} Room</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <ShoppingBag className="h-10 w-10 mx-auto mb-2" />
                  <p>This order doesn't include movie tickets</p>
                </div>
              )}

              {/* Food & Drinks */}
              {order.isFood && (
                <div>
                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Food & Drinks</h3>
                    <div className="space-y-3">
                      {/* This is mock data - in a real implementation, you'd map over actual food items */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted w-10 h-10 rounded flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Caramel Popcorn (Large)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: 1
                            </p>
                          </div>
                        </div>
                        <span>60,000 VND</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="mr-2 h-5 w-5" /> Ticket QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${order.OrderID}`}
                  alt="Ticket QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="mb-1 font-mono text-lg font-bold">
                {order.OrderID}
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                Show this code at the cinema entrance
              </p>

              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={handleCopyTicketCode}
                >
                  {qrCopied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Clipboard className="mr-2 h-4 w-4" />
                  )}
                  Copy Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{Number(order.TotalPrice).toLocaleString()} VND</span>
              </div>

              {/* If there was a discount */}
              {order.VoucherID && (
                <div className="flex justify-between text-green-500">
                  <span className="flex items-center">
                    <Gift className="mr-1.5 h-4 w-4" /> Discount
                  </span>
                  <span>-50,000 VND</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{Number(order.TotalPrice).toLocaleString()} VND</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Paid via {order.PaymentMethod}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link to="/">
                  <Film className="mr-2 h-4 w-4" />
                  Browse Movies
                </Link>
              </Button>

              {order.Status === "Processing" && (
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Request Refund
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
