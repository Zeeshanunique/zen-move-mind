
import { Link, useLocation } from "react-router-dom";
import { Activity, Dumbbell, Clock, History } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
      <div className="flex justify-around items-center py-2">
        <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
          <Activity size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link to="/exercise" className={`nav-item ${isActive("/exercise") ? "active" : ""}`}>
          <Dumbbell size={24} />
          <span className="text-xs mt-1">Exercise</span>
        </Link>
        <Link to="/meditation" className={`nav-item ${isActive("/meditation") ? "active" : ""}`}>
          <Clock size={24} />
          <span className="text-xs mt-1">Meditate</span>
        </Link>
        <Link to="/history" className={`nav-item ${isActive("/history") ? "active" : ""}`}>
          <History size={24} />
          <span className="text-xs mt-1">History</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
