import API_CINEMA from "./API_lib/API_CINEMA";

export interface Cinema {
  id: string;
  name: string;
  openingHours: string;
  closingHours: string;
  location: string;
  phoneNumbers: string[];
}

export const fetchCinemas = async (): Promise<Cinema[]> => {
  const response = await fetch(API_CINEMA.GET_CINEMAS);
  if (!response.ok) {
    throw new Error(`Lỗi HTTP: ${response.status} - ${response.statusText}`);
  }
  const data = await response.json();
  // const cinemasArray = Array.isArray(data) ? data : data.data || [];
  // return cinemasArray.map((cinema: any) => ({
  //   id: cinema.id,
  //   name: cinema.name,
  //   openingHours: cinema.openingHours,
  //   closingHours: cinema.closingHours,
  //   location: cinema.location,
  //   phoneNumbers: cinema.phoneNumbers || [],
  // }));
  return data;
};

export const saveCinema = async (
  cinema: Cinema,
  isUpdate: boolean
): Promise<void> => {
  const url = isUpdate ? API_CINEMA.UPDATE_CINEMA : API_CINEMA.CREATE_CINEMA;
  const method = isUpdate ? "PUT" : "POST";
  const response = await fetch(url, {
    method,
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
};

export const deleteCinema = async (cinemaId: string): Promise<void> => {
  const url = `${API_CINEMA.DELETE_CINEMA}/${cinemaId}`;
  console.log("URL DELETE:", url);
  const response = await fetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Không thể xóa rạp chiếu phim.");
  }
};
