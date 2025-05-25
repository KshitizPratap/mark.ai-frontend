import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import Mind from "@/pages/Mind";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import EditPostProvider from "@/context/EditPostProvider";
import AuthProvider from "@/context/AuthProvider";
import Layout from "./components/layout/Layout";
import CreatePost from "./pages/CreatePost";
import FullScreenLoader from "./components/ui/FullScreenLoader";
import { useAuth } from "@/context/AuthProvider";

function Router() {
  const { isVerifying } = useAuth();
  
  if (isVerifying) {
    return <FullScreenLoader message="Loading please wait..." />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Layout>
        <ProtectedRoute path="/create" component={CreatePost} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/calendar" component={Calendar} />
        <ProtectedRoute path="/mind" component={Mind} />
      </Layout>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <EditPostProvider>
            <Toaster />
            <Router />
          </EditPostProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
