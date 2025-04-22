import API from "@/lib/API_lib/API";

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export const fetchFoodItems = async (): Promise<FoodItem[]> => {
  const response = await fetch(`${API.SOURCE}/api/food`);
  if (!response.ok) {
    throw new Error("Failed to fetch food items.");
  }
  const data = await response.json();
  return data.map((item: any) => ({
    id: item.ItemID,
    name: item.Name,
    price: item.Price,
    stock: item.StockQuantity,
  }));
};
