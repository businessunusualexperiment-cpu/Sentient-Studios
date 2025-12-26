import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BrainCircuit, LogOut, User, Users, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function Header() {
  const { isAuthenticated, user, logout, isCurrentUserMentor } = useAuth();
  const navigate = useNavigate();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Mentors" },
  ];
  const authNavLinks = [
    { href: "/my-connections", label: "My Connections" },
    { href: "/mentor-dashboard", label: "Mentor Dashboard", mentorOnly: true },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-brand" />
            <span className="font-bold sm:inline-block">
              Sentient Studios
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && authNavLinks.map((link) => {
              if (link.mentorOnly && !isCurrentUserMentor) return null;
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      "transition-colors hover:text-foreground/80",
                      isActive ? "text-foreground" : "text-foreground/60"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle className="relative" />
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name || user.email} />
                    <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-connections')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>My Connections</span>
                </DropdownMenuItem>
                {isCurrentUserMentor && (
                  <DropdownMenuItem onClick={() => navigate('/mentor-dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Mentor Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden items-center space-x-2 md:flex">
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-brand hover:bg-brand-600">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </nav>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="block px-2 py-1 text-lg">{link.label}</Link>
                ))}
                <hr className="my-2" />
                {isAuthenticated ? (
                  <>
                    {authNavLinks.map((link) => {
                      if (link.mentorOnly && !isCurrentUserMentor) return null;
                      return <Link key={link.href} to={link.href} className="block px-2 py-1 text-lg">{link.label}</Link>
                    })}
                    <Link to="/profile" className="block px-2 py-1 text-lg">Profile</Link>
                    <Button onClick={logout} variant="ghost" className="justify-start px-2 py-1 text-lg">Logout</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-2 py-1 text-lg">Login</Link>
                    <Link to="/signup" className="block px-2 py-1 text-lg">Sign Up</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}