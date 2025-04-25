import API_FOOD from "./API_lib/API_FOOD";

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  flavor?: string; // For popcorn
  size?: "Small" | "Medium" | "Large"; // For popcorn and drinks
}

export const fetchFoodItems = async (): Promise<{
  popcorn: FoodItem[];
  drinks: FoodItem[];
  others: FoodItem[];
}> => {
  try {
    // Fetch popcorn items
    const popcornResponse = await fetch(`${API_FOOD.GET_ALL_FOODS}/popcorn`);
    if (!popcornResponse.ok) {
      throw new Error(`Failed to fetch popcorn: ${popcornResponse.status}`);
    }

    // Fetch drink items
    const drinkResponse = await fetch(`${API_FOOD.GET_ALL_FOODS}/drinks`);
    if (!drinkResponse.ok) {
      throw new Error(`Failed to fetch drinks: ${drinkResponse.status}`);
    }
    // Fetch others items
    const othersResponse = await fetch(`${API_FOOD.GET_ALL_FOODS}/others`);
    if (!othersResponse.ok) {
      throw new Error(`Failed to fetch others: ${othersResponse.status}`);
    }

    const popcornData = await popcornResponse.json();
    const drinkData = await drinkResponse.json();
    const othersData = await othersResponse.json();
    return {
      popcorn: popcornData.map((item: any) => ({
        id: item.ItemID,
        name: item.Name,
        price: item.Price,
        stock: item.StockQuantity,
        isAvailable: item.IsAvailable,
        flavor: item.Flavor,
        size: item.Size,
      })),
      drinks: drinkData.map((item: any) => ({
        id: item.ItemID,
        name: item.Name,
        price: item.Price,
        stock: item.StockQuantity,
        isAvailable: item.IsAvailable,
        size: item.Size,
      })),
      others: othersData.map((item: any) => ({
        id: item.ItemID,
        name: item.Name,
        price: item.Price,
        stock: item.StockQuantity,
        isAvailable: item.IsAvailable,
        size: item.Size,
      })),
    };
  } catch (error) {
    console.error("Error fetching food items:", error);
    return { popcorn: [], drinks: [], others: [] };
  }
};
