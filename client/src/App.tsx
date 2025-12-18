import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import TasksPage from "@/pages/tasks";
import CalendarPage from "@/pages/calendar";
import SupervisionsPage from "@/pages/supervisions";
import SchoolsPage from "@/pages/schools";
import AdditionalTasksPage from "@/pages/additional-tasks";
import ReportsPage from "@/pages/reports";
import ProfilePage from "@/pages/profile";
import UsersPage from "@/pages/users";

function Router() {
  return (
    <Switch>
      <Route path="/login">
        {() => (
          <div className="min-h-screen">
            <LoginPage />
          </div>
        )}
      </Route>
      <Route path="/">
        {() => {
          const token = localStorage.getItem('auth_token');
          if (!token) {
            window.location.href = '/login';
            return null;
          }
          return <Dashboard />;
        }}
      </Route>
      <Route path="/tasks" component={TasksPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/supervisions" component={SupervisionsPage} />
      <Route path="/schools" component={SchoolsPage} />
      <Route path="/additional" component={AdditionalTasksPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/users" component={UsersPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";
  
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b shrink-0">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
              <footer className="shrink-0 py-4 border-t text-center text-sm text-muted-foreground">
                designed by @w.yogaswara_kcdXi
              </footer>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
