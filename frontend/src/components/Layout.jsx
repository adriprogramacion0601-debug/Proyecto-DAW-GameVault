import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { GamepadIcon, Library, ListIcon, LogOut, Activity } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Inicio", path: "/", icon: GamepadIcon },
    { name: "Biblioteca", path: "/biblioteca", icon: Library },
    { name: "Listas", path: "/listas", icon: ListIcon },
    { name: "Estadísticas", path: "/estadisticas", icon: Activity },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl mr-6 group">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <GamepadIcon className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
            </motion.div>
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              GameVault
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
              Bienvenido, <span className="text-foreground">{user?.username}</span>
            </span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
