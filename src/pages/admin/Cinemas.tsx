import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Cinema {
  id: string;
  name: string;
  openingHours: string;
  closingHours: string;
  location: string;
  phoneNumbers: string[];
}

const Cinemas = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCinema, setCurrentCinema] = useState<Cinema | null>(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        console.log("Đang gọi API: http://localhost:5000/api/cinemas");
        const response = await fetch("http://localhost:5000/api/cinemas");
        if (!response.ok) {
          throw new Error(
            `Lỗi HTTP: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Dữ liệu API:", data);
        const mappedCinemas: Cinema[] = data.data
          ? data.data.map((cinema: any) => ({
              id: cinema.CinemaID,
              name: cinema.Name,
              openingHours: cinema.OpeningHours,
              closingHours: cinema.ClosingHours,
              location: cinema.Location,
              phoneNumbers: cinema.PhoneNumbers || [],
            }))
          : [];
        setCinemas(mappedCinemas);
        setFilteredCinemas(mappedCinemas);
      } catch (err) {
        console.error("Lỗi fetch:", err);
        setError("Không thể tải danh sách rạp chiếu phim.");
        toast({
          title: "Lỗi",
          description: (err as Error).message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = cinemas.filter(
      (cinema) =>
        cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cinema.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cinema.phoneNumbers.some((phone) =>
          phone.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredCinemas(filtered);
  }, [searchTerm, cinemas]);

  const handleSaveCinema = async (cinema: Cinema) => {
    try {
      console.log("Dữ liệu gửi đi:", cinema); // Log để debug
      if (currentCinema && !cinema.id) {
        throw new Error("CinemaID không được để trống khi cập nhật");
      }

      const response = currentCinema
        ? await fetch(`http://localhost:5000/api/cinemas/${cinema.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Name: cinema.name,
              OpeningHours: cinema.openingHours,
              ClosingHours: cinema.closingHours,
              Location: cinema.location,
              PhoneNumbers: cinema.phoneNumbers.filter((phone) => phone.trim()),
            }),
          })
        : await fetch("http://localhost:5000/api/cinemas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              CinemaID: cinema.id,
              Name: cinema.name,
              OpeningHours: cinema.openingHours,
              ClosingHours: cinema.closingHours,
              Location: cinema.location,
              PhoneNumbers: cinema.phoneNumbers.filter((phone) => phone.trim()),
            }),
          });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Không thể lưu thông tin rạp chiếu phim."
        );
      }

      toast({
        title: currentCinema ? "Cập nhật thành công" : "Thêm thành công",
        description: `Rạp chiếu phim đã được ${
          currentCinema ? "cập nhật" : "thêm"
        }.`,
      });

      setIsDialogOpen(false);
      setCurrentCinema(null);

      // Cập nhật danh sách rạp
      const updatedCinemas = await fetch(
        "http://localhost:5000/api/cinemas"
      ).then((res) => res.json());
      setCinemas(
        updatedCinemas.data.map((cinema: any) => ({
          id: cinema.CinemaID,
          name: cinema.Name,
          openingHours: cinema.OpeningHours,
          closingHours: cinema.ClosingHours,
          location: cinema.Location,
          phoneNumbers: cinema.PhoneNumbers || [],
        }))
      );
      setFilteredCinemas(
        updatedCinemas.data.map((cinema: any) => ({
          id: cinema.CinemaID,
          name: cinema.Name,
          openingHours: cinema.OpeningHours,
          closingHours: cinema.ClosingHours,
          location: cinema.Location,
          phoneNumbers: cinema.PhoneNumbers || [],
        }))
      );
    } catch (err) {
      console.error("Lỗi khi lưu Cinema:", err);
      toast({
        title: "Lỗi",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCinema = async (cinemaId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa rạp chiếu phim này?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cinemas/${cinemaId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể xóa rạp chiếu phim.");
        }

        toast({
          title: "Xóa thành công",
          description: "Rạp chiếu phim đã được xóa.",
        });

        setCinemas((prev) => prev.filter((cinema) => cinema.id !== cinemaId));
        setFilteredCinemas((prev) =>
          prev.filter((cinema) => cinema.id !== cinemaId)
        );
      } catch (err) {
        console.error("Lỗi khi xóa Cinema:", err);
        toast({
          title: "Lỗi",
          description: (err as Error).message,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        Đang tải danh sách rạp chiếu phim...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách rạp chiếu phim</h1>
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Tìm kiếm rạp theo tên, địa điểm hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => setIsDialogOpen(true)}>Thêm rạp</Button>
      </div>
      {filteredCinemas.length === 0 ? (
        <div className="text-center py-8">
          Không tìm thấy rạp chiếu phim nào.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên rạp</TableHead>
                <TableHead>Giờ mở cửa</TableHead>
                <TableHead>Giờ đóng cửa</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCinemas.map((cinema) => (
                <TableRow key={cinema.id}>
                  <TableCell>{cinema.id}</TableCell>
                  <TableCell>{cinema.name}</TableCell>
                  <TableCell>{cinema.openingHours}</TableCell>
                  <TableCell>{cinema.closingHours}</TableCell>
                  <TableCell>{cinema.location}</TableCell>
                  <TableCell>
                    {cinema.phoneNumbers.length > 0
                      ? cinema.phoneNumbers.join(", ")
                      : "Không có"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Chọn sửa Cinema:", cinema); // Log để debug
                          setCurrentCinema(cinema);
                          setIsDialogOpen(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCinema(cinema.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setCurrentCinema(null); // Reset khi đóng dialog
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCinema
                ? "Cập nhật rạp chiếu phim"
                : "Thêm rạp chiếu phim"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const cinema: Cinema = {
                id: currentCinema
                  ? currentCinema.id
                  : (formData.get("id") as string), // Giữ id khi cập nhật
                name: formData.get("name") as string,
                openingHours: formData.get("openingHours") as string,
                closingHours: formData.get("closingHours") as string,
                location: formData.get("location") as string,
                phoneNumbers: (formData.get("phoneNumbers") as string)
                  .split(",")
                  .map((phone) => phone.trim())
                  .filter((phone) => phone),
              };
              console.log("Cinema trước khi gửi:", cinema); // Log để debug
              handleSaveCinema(cinema);
            }}
          >
            <div className="space-y-4">
              <Input
                name="id"
                placeholder="ID (ví dụ: CIN001)"
                defaultValue={currentCinema?.id || ""}
                disabled={!!currentCinema} // Vô hiệu hóa khi cập nhật
                required={!currentCinema} // Bắt buộc khi thêm mới
              />
              <Input
                name="name"
                placeholder="Tên rạp"
                defaultValue={currentCinema?.name || ""}
                required
              />
              <Input
                name="openingHours"
                placeholder="Giờ mở cửa (HH:mm)"
                defaultValue={currentCinema?.openingHours || ""}
                required
              />
              <Input
                name="closingHours"
                placeholder="Giờ đóng cửa (HH:mm)"
                defaultValue={currentCinema?.closingHours || ""}
                required
              />
              <Input
                name="location"
                placeholder="Địa điểm"
                defaultValue={currentCinema?.location || ""}
                required
              />
              <Input
                name="phoneNumbers"
                placeholder="Số điện thoại (cách nhau bằng dấu phẩy)"
                defaultValue={currentCinema?.phoneNumbers.join(", ") || ""}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setCurrentCinema(null);
                }}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cinemas;
