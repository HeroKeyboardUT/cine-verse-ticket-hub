import React, { useState, useEffect } from "react";
import { Calendar, Search, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO, set } from "date-fns";
import OrderDialog from "@/components/admin/OrderDialog";
import {
  Order,
  getAllOrders
} from "@/lib/data_order";

function Orders() {
      const [ordersList, setordersList] = useState<Order[]>([]);
      const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
      const [searchTerm, setSearchTerm] = useState("");
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    
      useEffect(() => {
        const loadOrderList = async () => {
            // du lieu mau
            const ordersRes = await getAllOrders();
            setordersList(ordersRes);
            setFilteredOrders(ordersList);
            setLoading(false);
        };
    
        loadOrderList();
      }, []);
    
      useEffect(() => {
        const filtered = ordersList.filter(
          (st) =>
            st.OrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            st.CustomerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            st.Status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
      }, [searchTerm, ordersList]);

    
      if (loading)
        return <div className="text-center py-8">Loading showtimes...</div>;
      if (error)
        return <div className="text-center text-red-500 py-8">{error}</div>;


  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Calendar className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order</CardTitle>
          <CardDescription>
           Manage orders status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search showtimes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OrderID</TableHead>
                  <TableHead>CustomerID</TableHead>
                  <TableHead>Total Price (VND)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-6">
                      No order found
                    </TableCell>
                  </TableRow>
                ) : (
                    filteredOrders.map((order) => (
                    <TableRow key={order.OrderID}>
                      <TableCell>{order.OrderID}</TableCell>
                      <TableCell>{order.CustomerID}</TableCell>
                      <TableCell>{order.TotalPrice}</TableCell>
                      <TableCell>{order.Status}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentOrder(order);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

        <OrderDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          order={currentOrder? currentOrder:null}
        />
    </div>
  );
}
export default Orders;