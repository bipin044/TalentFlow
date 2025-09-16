import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { Jobs } from "./pages/Jobs";
import { Candidates } from "./pages/Candidates";
import { Assessments } from "./pages/Assessments";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { UserTypeSelection } from "./pages/UserTypeSelection";
import { useSeedData } from "./hooks/useSeedData";
import { AssessmentRuntime } from "./components/assessments/AssessmentRuntime";

const queryClient = new QueryClient();

const AppContent = () => {
  useSeedData();
  
  const AssessmentRuntimeRoute = () => {
    const { assessmentId } = useParams();
    return <AssessmentRuntime assessmentId={assessmentId as string} />;
  };
  
  const JobsRedirect = () => {
    const { jobId } = useParams();
    return <Navigate to={`/dashboard/jobs/${jobId}`} replace />;
  };

  const CandidatesRedirect = () => {
    const { candidateId } = useParams();
    const id = candidateId as string;
    const normalized = id?.startsWith('candidate-') ? id : `candidate-${id}`;
    return <Navigate to={`/dashboard/candidates/${normalized}`} replace />;
  };
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register" element={<UserTypeSelection />} />
      <Route path="/assessment/:assessmentId" element={<AssessmentRuntimeRoute />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:jobId" element={<Jobs />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/:candidateId" element={<Candidates />} />
        <Route path="candidates/profile/:candidateId" element={<Candidates />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="assessments/:assessmentId/preview" element={<Assessments />} />
        <Route path="assessments/:assessmentId/take" element={<AssessmentRuntimeRoute />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Public deep-link helpers */}
      <Route path="/jobs/:jobId" element={<JobsRedirect />} />
      <Route path="/candidates/:candidateId" element={<CandidatesRedirect />} />
      
      {/* Legacy route redirect */}
      <Route path="/app/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
