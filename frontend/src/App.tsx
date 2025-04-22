
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MovieDetails from "./pages/MovieDetails";
import SeatBooking from "./pages/SeatBooking";
import WatchMovie from "./pages/WatchMovie";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import Movies from "./pages/admin/Movies";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import Tickets from "./pages/admin/Tickets";
import Showtimes from "./pages/admin/Showtimes";
import Settings from "./pages/admin/Settings";
import Cinemas from "./pages/admin/Cinemas";
import FoodDrinks from "./pages/admin/FoodDrinks";
import SeatManagement from "./pages/admin/SeatManagement";
import Register from "./pages/Register";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                  <Index />
                </div>
                <Footer />
              </div>
            } 
          />
          <Route 
            path="/movie/:movieId" 
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                  <MovieDetails />
                </div>
                <Footer />
              </div>
            } 
          />
          <Route 
            path="/movie/:movieId/book" 
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                  <SeatBooking />
                </div>
                <Footer />
              </div>
            } 
          />
          <Route 
            path="/movie/:movieId/watch" 
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                  <WatchMovie />
                </div>
                <Footer />
              </div>
            } 
          />
          
          {/* Authentication routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="movies" element={<Movies />} />
            <Route path="cinemas" element={<Cinemas />} />
            <Route path="users" element={<Users />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="showtimes" element={<Showtimes />} />
            <Route path="food-drinks" element={<FoodDrinks />} />
            <Route path="seats" element={<SeatManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
