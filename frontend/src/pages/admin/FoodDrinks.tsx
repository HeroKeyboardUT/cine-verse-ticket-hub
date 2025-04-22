
import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Utensils, Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";

interface FoodItem {
  id: string;
  type: "POPCORN" | "DRINK" | "OTHERS";
  name: string;
  stockQuantity: number;
  isAvailable: boolean;
  price: number;
  // Additional fields for specific types
  flavor?: string;
  size?: "Small" | "Medium" | "Large";
}

const FoodDrinks = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for now - replace with actual API fetch
  useEffect(() => {
    const mockFoodItems: FoodItem[] = [
      { id: "FOOD001", type: "POPCORN", name: "Caramel Popcorn", stockQuantity: 100, isAvailable: true, price: 5.99, flavor: "Caramel", size: "Medium" },
      { id: "FOOD002", type: "POPCORN", name: "Butter Popcorn", stockQuantity: 150, isAvailable: true, price: 4.99, flavor: "Butter", size: "Large" },
      { id: "FOOD003", type: "DRINK", name: "Coca Cola", stockQuantity: 200, isAvailable: true, price: 3.99, size: "Medium" },
      { id: "FOOD004", type: "DRINK", name: "Sprite", stockQuantity: 180, isAvailable: true, price: 3.99, size: "Large" },
      { id: "FOOD005", type: "OTHERS", name: "Chocolate Bar", stockQuantity: 50, isAvailable: true, price: 2.99 },
    ];
    
    setFoodItems(mockFoodItems);
    setFilteredItems(mockFoodItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(foodItems);
    } else {
      const filtered = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, foodItems]);

  const handleAddItem = () => {
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: FoodItem) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Mock deletion - replace with actual API call
      setFoodItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Item Deleted",
        description: "The food/drink item has been successfully deleted.",
      });
    }
  };

  const handleSaveItem = (formData: FoodItem) => {
    if (currentItem) {
      // Update existing item - replace with actual API call
      setFoodItems(prev => prev.map(item => 
        item.id === currentItem.id ? {...formData, id: item.id} : item
      ));
      toast({
        title: "Item Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Create new item - replace with actual API call
      const newItem: FoodItem = {
        ...formData,
        id: `FOOD${String(foodItems.length + 1).padStart(3, '0')}`,
      };
      setFoodItems(prev => [...prev, newItem]);
      toast({
        title: "Item Added",
        description: `${formData.name} has been added successfully.`,
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Utensils className="mr-2 h-7 w-7" />
          Food & Drinks Management
        </h1>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Food & Drink Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading food and drink items...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">No food or drink items found.</div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size/Flavor</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.stockQuantity}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.size && `Size: ${item.size}`}
                        {item.flavor && `Flavor: ${item.flavor}`}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentItem ? "Edit Food/Drink Item" : "Add New Food/Drink Item"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const itemData: FoodItem = {
                id: currentItem?.id || "",
                name: formData.get("name") as string,
                type: formData.get("type") as "POPCORN" | "DRINK" | "OTHERS",
                price: parseFloat(formData.get("price") as string),
                stockQuantity: parseInt(formData.get("stockQuantity") as string),
                isAvailable: formData.get("isAvailable") === "true",
              };

              if (itemData.type === "POPCORN") {
                itemData.flavor = formData.get("flavor") as string;
                itemData.size = formData.get("size") as "Small" | "Medium" | "Large";
              } else if (itemData.type === "DRINK") {
                itemData.size = formData.get("size") as "Small" | "Medium" | "Large";
              }

              handleSaveItem(itemData);
            }}
          >
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Item name"
                    defaultValue={currentItem?.name || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    name="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={currentItem?.type || "OTHERS"}
                    required
                  >
                    <option value="POPCORN">Popcorn</option>
                    <option value="DRINK">Drink</option>
                    <option value="OTHERS">Others</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    defaultValue={currentItem?.price || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    placeholder="Stock quantity"
                    defaultValue={currentItem?.stockQuantity || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isAvailable">Availability</Label>
                  <select
                    id="isAvailable"
                    name="isAvailable"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={currentItem?.isAvailable ? "true" : "false"}
                  >
                    <option value="true">Available</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <select
                    id="size"
                    name="size"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={currentItem?.size || "Medium"}
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flavor">Flavor (for Popcorn)</Label>
                  <Input
                    id="flavor"
                    name="flavor"
                    placeholder="Flavor"
                    defaultValue={currentItem?.flavor || ""}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodDrinks;
