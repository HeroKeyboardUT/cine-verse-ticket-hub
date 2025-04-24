import React from "react";
import { Button } from "@/components/ui/button";
import { FoodItem } from "@/lib/data_food";

interface FoodSelectorProps {
  popcornItems: FoodItem[];
  drinkItems: FoodItem[];
  othersItems: FoodItem[];
  selectedFood: { [key: string]: number };
  onFoodSelect: (itemId: string, quantity: number) => void;
}

export const FoodSelector: React.FC<FoodSelectorProps> = ({
  popcornItems,
  drinkItems,
  othersItems,
  selectedFood,
  onFoodSelect,
}) => {
  return (
    <div className="p-6 bg-black/20 rounded-lg mb-8">
      <h3 className="text-xl font-medium mb-4">Food & Drinks</h3>

      {/* Popcorn Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-amber-400 mb-3">Popcorn</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {popcornItems.map((popcorn) => (
            <div
              key={popcorn.id}
              className="flex items-center justify-between bg-black/30 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{popcorn.name}</p>
                <p className="text-sm text-gray-400">
                  {popcorn.flavor && `${popcorn.flavor} - `}
                  {popcorn.size && `${popcorn.size}`}
                </p>
                <p className="text-primary">
                  {popcorn.price.toLocaleString()} VND
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFoodSelect(popcorn.id, -1)}
                  disabled={!selectedFood[popcorn.id]}
                >
                  -
                </Button>
                <span className="w-6 text-center">
                  {selectedFood[popcorn.id] || 0}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFoodSelect(popcorn.id, 1)}
                  disabled={!popcorn.isAvailable}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drinks Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-blue-400 mb-3">Drinks</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {drinkItems.map((drink) => (
            <div
              key={drink.id}
              className="flex items-center justify-between bg-black/30 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{drink.name}</p>
                <p className="text-sm text-gray-400">
                  {drink.size && `${drink.size}`}
                </p>
                <p className="text-primary">
                  {drink.price.toLocaleString()} VND
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFoodSelect(drink.id, -1)}
                  disabled={!selectedFood[drink.id]}
                >
                  -
                </Button>
                <span className="w-6 text-center">
                  {selectedFood[drink.id] || 0}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFoodSelect(drink.id, 1)}
                  disabled={!drink.isAvailable}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Others Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-orange-400 mb-3">Others</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {othersItems.map((others) => (
            <div
              key={others.id}
              className="flex items-center justify-between bg-black/30 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{others.name}</p>

                <p className="text-primary">
                  {others.price.toLocaleString()} VND
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFoodSelect(others.id, -1)}
                  disabled={!selectedFood[others.id]}
                >
                  -
                </Button>
                <span className="w-6 text-center">
                  {selectedFood[others.id] || 0}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFoodSelect(others.id, 1)}
                  disabled={!others.isAvailable}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
