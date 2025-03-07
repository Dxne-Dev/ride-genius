
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages publiques
import Index from "./pages/Index";
import Search from "./pages/Search";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Legal from "./pages/Legal";
import Help from "./pages/Help";

// Pages authentifiées (tous les rôles)
import Profile from "./pages/Profile";
import RideDetails from "./pages/rides/RideDetails";

// Pages conducteur
import DriverDashboard from "./pages/driver/Dashboard";
import DriverOffer from "./pages/driver/Offer";
import DriverRides from "./pages/driver/Rides";

// Pages passager
import PassengerDashboard from "./pages/passenger/Dashboard";
import PassengerBookings from "./pages/passenger/Bookings";

// Pages admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRides from "./pages/admin/Rides";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/help" element={<Help />} />
            
            {/* Routes authentifiées (tous les rôles) */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/rides/:id" element={
              <ProtectedRoute>
                <RideDetails />
              </ProtectedRoute>
            } />
            
            {/* Routes conducteur */}
            <Route path="/driver/dashboard" element={
              <ProtectedRoute requiredRole="conducteur">
                <DriverDashboard />
              </ProtectedRoute>
            } />
            <Route path="/driver/offer" element={
              <ProtectedRoute requiredRole="conducteur">
                <DriverOffer />
              </ProtectedRoute>
            } />
            <Route path="/driver/rides" element={
              <ProtectedRoute requiredRole="conducteur">
                <DriverRides />
              </ProtectedRoute>
            } />
            
            {/* Routes passager */}
            <Route path="/passenger/dashboard" element={
              <ProtectedRoute requiredRole="passager">
                <PassengerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/passenger/bookings" element={
              <ProtectedRoute requiredRole="passager">
                <PassengerBookings />
              </ProtectedRoute>
            } />
            
            {/* Routes admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/rides" element={
              <ProtectedRoute requiredRole="admin">
                <AdminRides />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
