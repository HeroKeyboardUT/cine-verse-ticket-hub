
import React, { useState, useEffect } from 'react';
import { BookingController } from '@/controllers/BookingController';
import { FoodOrderItem } from '@/models/BookingModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface FoodItem {
  ItemID: string;
  Name: string;
  Price: number;
  IsAvailable: boolean;
  Type?: string;
  Flavour?: string;
  Size?: string;
}

interface FoodAndDrinkSelectorProps {
  onFoodItemsChange: (items: FoodOrderItem[]) => void;
}

const FoodAndDrinkSelector: React.FC<FoodAndDrinkSelectorProps> = ({ onFoodItemsChange }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<FoodOrderItem[]>([]);
  
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        // In a real app, we would use BookingController.getFoodAndDrinks()
        // For now, let's use mock data
        const mockItems = [
          { ItemID: 'FOD001', Name: 'Small Popcorn', Price: 4.99, IsAvailable: true, Type: 'Popcorn', Flavour: 'Salted', Size: 'Small' },
          { ItemID: 'FOD002', Name: 'Large Popcorn', Price: 6.99, IsAvailable: true, Type: 'Popcorn', Flavour: 'Salted', Size: 'Large' },
          { ItemID: 'FOD003', Name: 'Caramel Popcorn', Price: 5.99, IsAvailable: true, Type: 'Popcorn', Flavour: 'Caramel', Size: 'Medium' },
          { ItemID: 'FOD004', Name: 'Soda', Price: 3.99, IsAvailable: true, Type: 'Drink', Size: 'Regular' },
          { ItemID: 'FOD005', Name: 'Nachos', Price: 5.99, IsAvailable: true, Type: 'Snack' },
          { ItemID: 'FOD006', Name: 'Hot Dog', Price: 4.99, IsAvailable: true, Type: 'Snack' },
        ];
        
        setFoodItems(mockItems);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load food items:', error);
        setLoading(false);
      }
    };
    
    fetchFoodItems();
  }, []);
  
  const updateItemQuantity = (item: FoodItem, quantity: number) => {
    setSelectedItems(prevItems => {
      // Find if item already exists in the cart
      const existingItemIndex = prevItems.findIndex(i => i.ItemID === item.ItemID);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          updatedItems.splice(existingItemIndex, 1);
        } else {
          // Update quantity
          updatedItems[existingItemIndex].Quantity = quantity;
        }
        
        onFoodItemsChange(updatedItems);
        return updatedItems;
      } else if (quantity > 0) {
        // Add new item
        const newItems = [
          ...prevItems,
          { ItemID: item.ItemID, Quantity: quantity, Price: item.Price }
        ];
        onFoodItemsChange(newItems);
        return newItems;
      }
      
      // No change needed
      return prevItems;
    });
  };
  
  const getItemQuantity = (itemId: string): number => {
    const item = selectedItems.find(i => i.ItemID === itemId);
    return item ? item.Quantity : 0;
  };
  
  if (loading) {
    return <div>Loading food and drink options...</div>;
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {foodItems.map(item => (
          <div key={item.ItemID} className="p-3 border border-gray-700 rounded-md flex justify-between items-center">
            <div>
              <h4 className="font-medium">{item.Name}</h4>
              <p className="text-sm text-gray-400">${item.Price.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateItemQuantity(item, getItemQuantity(item.ItemID) - 1)}
                disabled={getItemQuantity(item.ItemID) === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-10 text-center">{getItemQuantity(item.ItemID)}</div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateItemQuantity(item, getItemQuantity(item.ItemID) + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodAndDrinkSelector;
