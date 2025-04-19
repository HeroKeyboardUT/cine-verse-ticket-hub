import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  membershipLevel: string;
  registrationDate: string | null;
  totalSpent: number;
  totalOrders: number;
}

interface Order {
  orderId: string;
  orderTime: string | null;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  isTicket: boolean;
  isFood: boolean;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    phoneNumber: "",
    membershipLevel: "Standard",
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/customers");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Không thể tải danh sách khách hàng"
          );
        }
        const data = await response.json();
        setUserList(
          data.map((user: any) => ({
            id: user.CustomerID,
            name: user.FullName,
            email: user.Email,
            role: user.MembershipLevel === "VIP" ? "VIP" : "Customer",
            dateOfBirth: user.DateOfBirth,
            phoneNumber: user.PhoneNumber,
            membershipLevel: user.MembershipLevel,
            registrationDate: user.RegistrationDate,
            totalSpent: parseFloat(user.TotalSpent) || 0,
            totalOrders: parseInt(user.TotalOrders) || 0,
          }))
        );
      } catch (err) {
        console.error("Lỗi khi tải khách hàng:", err);
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

    fetchUsers();
  }, []);

  // Filter and sort users
  useEffect(() => {
    let filtered = [...userList];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, sortField, sortDirection, userList]);

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FullName: newUser.fullName,
          Email: newUser.email,
          DateOfBirth: newUser.dateOfBirth || null,
          PhoneNumber: newUser.phoneNumber || null,
          MembershipLevel: newUser.membershipLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể thêm khách hàng");
      }

      const { customerId } = await response.json();
      const fetchUsers = await fetch("http://localhost:5000/api/customers");
      const data = await fetchUsers.json();
      setUserList(
        data.map((user: any) => ({
          id: user.CustomerID,
          name: user.FullName,
          email: user.Email,
          role: user.MembershipLevel === "VIP" ? "VIP" : "Customer",
          dateOfBirth: user.DateOfBirth,
          phoneNumber: user.PhoneNumber,
          membershipLevel: user.MembershipLevel,
          registrationDate: user.RegistrationDate,
          totalSpent: parseFloat(user.TotalSpent) || 0,
          totalOrders: parseInt(user.TotalOrders) || 0,
        }))
      );

      setShowAddDialog(false);
      setNewUser({
        fullName: "",
        email: "",
        dateOfBirth: "",
        phoneNumber: "",
        membershipLevel: "Standard",
      });
      toast({
        title: "Thêm khách hàng thành công",
        description: `Khách hàng #${customerId} đã được thêm.`,
      });
    } catch (err) {
      console.error("Lỗi khi thêm khách hàng:", err);
      toast({
        title: "Lỗi",
        description:
          err instanceof Error ? err.message : "Không thể thêm khách hàng",
        variant: "destructive",
      });
    }
  };

  // Handle edit user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${selectedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FullName: newUser.fullName,
            Email: newUser.email,
            DateOfBirth: newUser.dateOfBirth || null,
            PhoneNumber: newUser.phoneNumber || null,
            MembershipLevel: newUser.membershipLevel,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật khách hàng");
      }

      const fetchUsers = await fetch("http://localhost:5000/api/customers");
      const data = await fetchUsers.json();
      setUserList(
        data.map((user: any) => ({
          id: user.CustomerID,
          name: user.FullName,
          email: user.Email,
          role: user.MembershipLevel === "VIP" ? "VIP" : "Customer",
          dateOfBirth: user.DateOfBirth,
          phoneNumber: user.PhoneNumber,
          membershipLevel: user.MembershipLevel,
          registrationDate: user.RegistrationDate,
          totalSpent: parseFloat(user.TotalSpent) || 0,
          totalOrders: parseInt(user.TotalOrders) || 0,
        }))
      );

      setShowEditDialog(false);
      setNewUser({
        fullName: "",
        email: "",
        dateOfBirth: "",
        phoneNumber: "",
        membershipLevel: "Standard",
      });
      setSelectedUser(null);
      toast({
        title: "Cập nhật khách hàng thành công",
        description: `Khách hàng #${selectedUser.id} đã được cập nhật.`,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật khách hàng:", err);
      toast({
        title: "Lỗi",
        description:
          err instanceof Error ? err.message : "Không thể cập nhật khách hàng",
        variant: "destructive",
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa khách hàng");
      }

      setUserList(userList.filter((user) => user.id !== userId));
      toast({
        title: "Xóa khách hàng thành công",
        description: `Khách hàng #${userId} đã được xóa.`,
      });
    } catch (err) {
      console.error("Lỗi khi xóa khách hàng:", err);
      toast({
        title: "Lỗi",
        description:
          err instanceof Error ? err.message : "Không thể xóa khách hàng",
        variant: "destructive",
      });
    }
  };

  // Handle view orders
  const handleViewOrders = async (user: User) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${user.id}/orders`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Không thể tải danh sách đơn hàng"
        );
      }
      const data = await response.json();
      setOrders(
        data.map((order: any) => ({
          orderId: order.OrderID,
          orderTime: order.orderTime,
          status: order.Status,
          totalPrice: parseFloat(order.TotalPrice) || 0,
          paymentMethod: order.PaymentMethod,
          isTicket: order.isTicket,
          isFood: order.isFood,
        }))
      );
      setSelectedUser(user);
      setShowOrdersDialog(true);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      toast({
        title: "Lỗi",
        description:
          err instanceof Error ? err.message : "Không thể tải đơn hàng",
        variant: "destructive",
      });
    }
  };

  // Format date safely
  const formatDate = (date: string | null): string => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? "N/A"
      : parsedDate.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  };

  if (loading)
    return (
      <div className="text-center py-8">Đang tải danh sách khách hàng...</div>
    );
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Users className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Quản lý khách hàng</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Khách hàng</CardTitle>
          <CardDescription>
            Quản lý khách hàng và thông tin đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm khách hàng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm khách hàng mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, fullName: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newUser.dateOfBirth}
                      onChange={(e) =>
                        setNewUser({ ...newUser, dateOfBirth: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input
                      id="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phoneNumber: e.target.value })
                      }
                      placeholder="0123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="membershipLevel">Cấp thành viên</Label>
                    <Select
                      value={newUser.membershipLevel}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, membershipLevel: value })
                      }
                    >
                      <SelectTrigger id="membershipLevel">
                        <SelectValue placeholder="Chọn cấp thành viên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Thêm khách hàng</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Họ và tên
                      {sortField === "name" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {sortField === "email" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort("membershipLevel")}
                  >
                    <div className="flex items-center">
                      Cấp thành viên
                      {sortField === "membershipLevel" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hidden lg:table-cell"
                    onClick={() => handleSort("registrationDate")}
                  >
                    <div className="flex items-center">
                      Ngày đăng ký
                      {sortField === "registrationDate" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Không tìm thấy khách hàng
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.membershipLevel}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(user.registrationDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewOrders(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setNewUser({
                                fullName: user.name,
                                email: user.email,
                                dateOfBirth: user.dateOfBirth
                                  ? new Date(user.dateOfBirth)
                                      .toISOString()
                                      .split("T")[0]
                                  : "",
                                phoneNumber: user.phoneNumber || "",
                                membershipLevel: user.membershipLevel,
                              });
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Dialog chỉnh sửa khách hàng */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={newUser.fullName}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="example@email.com"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={newUser.dateOfBirth}
                onChange={(e) =>
                  setNewUser({ ...newUser, dateOfBirth: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={newUser.phoneNumber}
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
                placeholder="0123456789"
              />
            </div>
            <div>
              <Label htmlFor="membershipLevel">Cấp thành viên</Label>
              <Select
                value={newUser.membershipLevel}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, membershipLevel: value })
                }
              >
                <SelectTrigger id="membershipLevel">
                  <SelectValue placeholder="Chọn cấp thành viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Cập nhật khách hàng</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog xem đơn hàng */}
      <Dialog open={showOrdersDialog} onOpenChange={setShowOrdersDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đơn hàng của {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Loại</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Không tìm thấy đơn hàng
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">
                        {order.orderId}
                      </TableCell>
                      <TableCell>{formatDate(order.orderTime)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        {order.isTicket ? "Vé" : ""}{" "}
                        {order.isFood ? "Đồ ăn" : ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
