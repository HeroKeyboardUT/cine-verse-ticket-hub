import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search, Download, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define types for Ticket
type TicketStatus = "Booked" | "Completed" | "Cancelled";

interface Ticket {
  id: string;
  movieId: string;
  movieTitle: string;
  customerName: string;
  seats: string;
  showtime: string; // ISO string
  cinemaName: string;
  status: TicketStatus;
  amount: number;
}

interface Cinema {
  id: string;
  name: string;
}

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");
  const [cinemaFilter, setCinemaFilter] = useState("All");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [isExporting, setIsExporting] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // State cho form thêm vé
  const [newTicket, setNewTicket] = useState({
    customerId: "",
    movieId: "",
    roomId: "",
    startTime: "",
    seats: "",
    totalPrice: "",
    status: "Booked" as TicketStatus,
    paymentMethod: "Cash",
  });

  // Fetch tickets and cinemas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tickets
        const ticketsRes = await fetch("http://localhost:5000/api/tickets");
        if (!ticketsRes.ok) {
          const errorData = await ticketsRes.json();
          throw new Error(errorData.message || "Không thể tải danh sách vé");
        }
        const ticketsData = await ticketsRes.json();

        // Fetch cinemas
        const cinemasRes = await fetch("http://localhost:5000/api/cinemas");
        if (!cinemasRes.ok) {
          const errorData = await cinemasRes.json();
          throw new Error(errorData.message || "Không thể tải danh sách rạp");
        }
        const cinemasData = await cinemasRes.json();

        setTickets(
          ticketsData.map((ticket: any) => ({
            id: ticket.OrderID.toString(),
            movieId: ticket.MovieID || "N/A",
            movieTitle: ticket.MovieTitle || "Unknown",
            customerName: ticket.CustomerName || "Unknown",
            seats: ticket.Seats || "N/A",
            showtime: ticket.showtime, // Đã là ISO string từ API
            cinemaName: ticket.CinemaName || "Unknown",
            status: ticket.Status as TicketStatus,
            amount: parseFloat(ticket.TotalPrice) || 0,
          }))
        );

        setCinemas(
          cinemasData.data.map((cinema: any) => ({
            id: cinema.CinemaID,
            name: cinema.Name,
          }))
        );
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(err instanceof Error ? err.message : "Lỗi không xác định");
        toast({
          title: "Lỗi",
          description:
            err instanceof Error ? err.message : "Không thể tải dữ liệu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;

    const matchesCinema =
      cinemaFilter === "All" ||
      ticket.cinemaName ===
        cinemas.find((cinema) => cinema.id === cinemaFilter)?.name;

    // Date range filtering
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const ticketDate = new Date(ticket.showtime);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      matchesDateRange = ticketDate >= dateRange.from && ticketDate <= toDate;
    }

    return matchesSearch && matchesStatus && matchesCinema && matchesDateRange;
  });

  // Calculate totals
  const calculateTotals = () => {
    const totalAmount = filteredTickets.reduce(
      (sum, ticket) => sum + ticket.amount,
      0
    );
    const totalTickets = filteredTickets.length;
    const completedTickets = filteredTickets.filter(
      (ticket) => ticket.status === "Completed"
    ).length;
    const bookedTickets = filteredTickets.filter(
      (ticket) => ticket.status === "Booked"
    ).length;
    const cancelledTickets = filteredTickets.filter(
      (ticket) => ticket.status === "Cancelled"
    ).length;

    return {
      totalAmount,
      totalTickets,
      completedTickets,
      bookedTickets,
      cancelledTickets,
    };
  };

  const totals = calculateTotals();

  // Handle delete ticket
  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vé này không?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${encodeURIComponent(ticketId)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa vé");
      }

      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      toast({
        title: "Xóa vé thành công",
        description: `Vé #${ticketId} đã được xóa.`,
      });
    } catch (err) {
      console.error("Lỗi khi xóa vé:", err);
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Không thể xóa vé",
        variant: "destructive",
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (
    ticketId: string,
    newStatus: TicketStatus
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${encodeURIComponent(ticketId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật trạng thái");
      }

      setTickets(
        tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      toast({
        title: "Cập nhật trạng thái",
        description: `Trạng thái vé đã được cập nhật thành ${newStatus}.`,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      toast({
        title: "Lỗi",
        description:
          err instanceof Error ? err.message : "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    }
  };

  // Handle add ticket
  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const seatsArray = newTicket.seats
        .split(",")
        .map((s) => parseInt(s.trim()));
      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: newTicket.customerId,
          movieId: newTicket.movieId,
          roomId: parseInt(newTicket.roomId),
          startTime: new Date(newTicket.startTime).toISOString(),
          seats: seatsArray,
          totalPrice: parseFloat(newTicket.totalPrice),
          status: newTicket.status,
          paymentMethod: newTicket.paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể thêm vé");
      }

      const { orderId } = await response.json();
      // Tải lại danh sách vé
      const ticketsRes = await fetch("http://localhost:5000/api/tickets");
      const ticketsData = await ticketsRes.json();
      setTickets(
        ticketsData.map((ticket: any) => ({
          id: ticket.OrderID.toString(),
          movieId: ticket.MovieID || "N/A",
          movieTitle: ticket.MovieTitle || "Unknown",
          customerName: ticket.CustomerName || "Unknown",
          seats: ticket.Seats || "N/A",
          showtime: ticket.showtime,
          cinemaName: ticket.CinemaName || "Unknown",
          status: ticket.Status as TicketStatus,
          amount: parseFloat(ticket.TotalPrice) || 0,
        }))
      );

      setShowAddDialog(false);
      setNewTicket({
        customerId: "",
        movieId: "",
        roomId: "",
        startTime: "",
        seats: "",
        totalPrice: "",
        status: "Booked",
        paymentMethod: "Cash",
      });
      toast({
        title: "Thêm vé thành công",
        description: `Vé #${orderId} đã được thêm.`,
      });
    } catch (err) {
      console.error("Lỗi khi thêm vé:", err);
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Không thể thêm vé",
        variant: "destructive",
      });
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    setIsExporting(true);

    setTimeout(() => {
      const headers = [
        "ID",
        "Phim",
        "Khách hàng",
        "Ghế",
        "Thời gian chiếu",
        "Rạp",
        "Trạng thái",
        "Số tiền",
      ];
      const csvContent =
        headers.join(",") +
        "\n" +
        filteredTickets
          .map((ticket) =>
            [
              ticket.id,
              `"${ticket.movieTitle.replace(/"/g, '""')}"`,
              `"${ticket.customerName.replace(/"/g, '""')}"`,
              `"${ticket.seats.replace(/"/g, '""')}"`,
              `"${new Date(ticket.showtime).toLocaleString("vi-VN")}"`,
              `"${ticket.cinemaName.replace(/"/g, '""')}"`,
              ticket.status,
              ticket.amount.toFixed(2),
            ].join(",")
          )
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `tickets_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      toast({
        title: "Xuất file thành công",
        description: "Danh sách vé đã được xuất thành file CSV.",
      });
    }, 1000);
  };

  // Display different colors for statuses
  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "Booked":
        return <Badge className="bg-blue-500">Đã đặt</Badge>;
      case "Completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading)
    return <div className="text-center py-8">Đang tải danh sách vé...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý vé</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Đang xuất..." : "Xuất CSV"}
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Thêm vé
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm vé mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTicket} className="space-y-4">
                <div>
                  <Label htmlFor="customerId">Mã khách hàng</Label>
                  <Input
                    id="customerId"
                    value={newTicket.customerId}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, customerId: e.target.value })
                    }
                    placeholder="CUS0001"
                  />
                </div>
                <div>
                  <Label htmlFor="movieId">Mã phim</Label>
                  <Input
                    id="movieId"
                    value={newTicket.movieId}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, movieId: e.target.value })
                    }
                    placeholder="MOV001"
                  />
                </div>
                <div>
                  <Label htmlFor="roomId">Mã phòng</Label>
                  <Input
                    id="roomId"
                    type="number"
                    value={newTicket.roomId}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, roomId: e.target.value })
                    }
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={newTicket.startTime}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="seats">Ghế (cách nhau bởi dấu phẩy)</Label>
                  <Input
                    id="seats"
                    value={newTicket.seats}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, seats: e.target.value })
                    }
                    placeholder="1,2,3"
                  />
                </div>
                <div>
                  <Label htmlFor="totalPrice">Tổng giá</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    value={newTicket.totalPrice}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, totalPrice: e.target.value })
                    }
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={newTicket.status}
                    onValueChange={(value) =>
                      setNewTicket({
                        ...newTicket,
                        status: value as TicketStatus,
                      })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Booked">Đã đặt</SelectItem>
                      <SelectItem value="Completed">Hoàn thành</SelectItem>
                      <SelectItem value="Cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                  <Select
                    value={newTicket.paymentMethod}
                    onValueChange={(value) =>
                      setNewTicket({ ...newTicket, paymentMethod: value })
                    }
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Tiền mặt</SelectItem>
                      <SelectItem value="Card">Thẻ</SelectItem>
                      <SelectItem value="Online">Trực tuyến</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Thêm vé</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vé</CardTitle>
          <CardDescription>
            Quản lý và tìm kiếm các giao dịch vé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm vé..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as TicketStatus | "All")
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Booked">Đã đặt</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cinema">Rạp</Label>
              <Select
                value={cinemaFilter}
                onValueChange={(value) => setCinemaFilter(value)}
              >
                <SelectTrigger id="cinema">
                  <SelectValue placeholder="Chọn rạp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Tất cả rạp</SelectItem>
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Khoảng thời gian</Label>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Tổng số vé
                </div>
                <div className="text-2xl font-bold">{totals.totalTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Đã đặt
                </div>
                <div className="text-2xl font-bold text-blue-500">
                  {totals.bookedTickets}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Hoàn thành
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {totals.completedTickets}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Tổng doanh thu
                </div>
                <div className="text-2xl font-bold">
                  ${totals.totalAmount.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Phim</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="hidden md:table-cell">Rạp</TableHead>
                  <TableHead className="hidden lg:table-cell">Ghế</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Thời gian chiếu
                  </TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.movieTitle}</TableCell>
                      <TableCell>{ticket.customerName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {ticket.cinemaName}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {ticket.seats}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(ticket.showtime).toLocaleString("vi-VN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status}
                          onValueChange={(value) =>
                            handleStatusChange(ticket.id, value as TicketStatus)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue>
                              {getStatusBadge(ticket.status)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Booked">Đã đặt</SelectItem>
                            <SelectItem value="Completed">
                              Hoàn thành
                            </SelectItem>
                            <SelectItem value="Cancelled">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>${ticket.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTicket(ticket.id)}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      <p className="text-muted-foreground">Không tìm thấy vé</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tickets;
