import { useAccount, useDisconnect } from 'wagmi';
import { Link } from 'react-router-dom';
import { User, Vote, BarChart3, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <nav className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/497f6821-7cfd-4bc6-bb50-e3bc41a8e7c7.png" alt="Satya Vote" className="h-8 w-8" />
          <span className="text-xl font-semibold">Satya Vote</span>
        </div>

        {address && (
          <div className="flex items-center gap-6">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link 
              to="/vote" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Vote className="h-4 w-4" />
              Vote
            </Link>
            <Link 
              to="/results" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Results
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-4">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => disconnect()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;