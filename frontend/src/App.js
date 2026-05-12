import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicLayout from "@/components/PublicLayout";
import DashboardLayout from "@/components/DashboardLayout";

import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import InterviewSetup from "@/pages/InterviewSetup";
import InterviewRoom from "@/pages/InterviewRoom";
import InterviewResults from "@/pages/InterviewResults";
import Practice from "@/pages/Practice";
import CurrentAffairs from "@/pages/CurrentAffairs";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";

import "@/App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/interview/setup" element={<ProtectedRoute><DashboardLayout><InterviewSetup /></DashboardLayout></ProtectedRoute>} />
            <Route path="/interview/room/:id" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
            <Route path="/interview/results/:id" element={<ProtectedRoute><DashboardLayout><InterviewResults /></DashboardLayout></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><DashboardLayout><Practice /></DashboardLayout></ProtectedRoute>} />
            <Route path="/current-affairs" element={<ProtectedRoute><DashboardLayout><CurrentAffairs /></DashboardLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><DashboardLayout><Subscription /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" richColors closeButton theme="dark" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
