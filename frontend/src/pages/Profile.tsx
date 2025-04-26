import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  CreditCard,
  Ticket,
  Calendar,
  Clock,
  Star,
  Film,
  MapPin,
  ShoppingBag,
  Edit,
  LogOut,
  Mail,
  Phone,
  Gift,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { OrderCard } from "@/components/profile/OrderCard";
import { UserStats } from "@/components/profile/UserStats";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { fetchUserOrders, Order } from "@/lib/data_order";
import { fetchUserById } from "@/lib/data_user";
import { format } from "date-fns";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "You need to log in",
        description: "Please log in to view your profile",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Get stored user data for now
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (!userData.id) {
          throw new Error("User data not found");
        }
        const user = await fetchUserById(userData.id);
        // Fetch user orders
        const userOrders = await fetchUserOrders(userData.id);

        setUser(user);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error loading profile",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
  };

  const handleUpdateProfile = (updatedData: any) => {
    // This would normally make an API call
    // For now, we'll just update the local state
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });

    setShowEditDialog(false);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter orders by status
  const upcomingOrders = orders.filter(
    (order) => order.Status === "Processing" || order.Status === "Booked"
  );

  const pastOrders = orders.filter(
    (order) => order.Status === "Completed" || order.Status === "Cancelled"
  );

  console.log(user);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/user-avatar.png" alt={user.FullName} />
                  <AvatarFallback className="text-lg bg-primary text-white">
                    {getInitials(user.FullName)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.FullName}</h2>
                <Badge className="mt-2" variant="outline">
                  {user.MembershipLevel} Member
                </Badge>
                <div className="w-full mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.PhoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.PhoneNumber}</span>
                    </div>
                  )}
                  {user.DateOfBirth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(user.DateOfBirth), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  {user.RegistrationDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                      <span>
                        Member since{" "}
                        {format(new Date(user.RegistrationDate), "MMMM yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <UserStats
            totalOrders={orders.length}
            totalSpent={user.totalSpent || 0}
            membershipLevel={user.MembershipLevel}
            pointsEarned={Math.floor((user.totalSpent || 0) / 10000)}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">My Orders</h1>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-xl font-medium mb-2">
                      No upcoming orders
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have any upcoming movie tickets.
                    </p>
                    <Link to="/">
                      <Button>Browse Movies</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                upcomingOrders.map((order) => (
                  <OrderCard key={order.OrderID} order={order} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-xl font-medium mb-2">
                      No past orders found
                    </h3>
                    <p className="text-muted-foreground">
                      Your order history will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pastOrders.map((order) => (
                  <OrderCard key={order.OrderID} order={order} isPast />
                ))
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Movies</CardTitle>
                  <CardDescription>
                    Movies you've rated 4 stars or higher
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* This would come from an API in a real implementation */}
                  <Link to="/movie/MOV001" className="block">
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition">
                      <div className="h-20 w-14 rounded bg-muted flex-shrink-0 overflow-hidden">
                        <img
                          src={
                            "https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg"
                          }
                          alt="Movie poster"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Avengers: Endgame</div>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <Star className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="ml-1 text-xs text-muted-foreground">
                            4.0
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Watched on April 15, 2025
                        </div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={user}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default Profile;
