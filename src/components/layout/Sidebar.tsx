// src/components/layout/Sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/theme-toggle";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import { logout } from "@/api/authApi";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  { title: "Pengguna", href: "/users", icon: <Users className="h-5 w-5" /> },
  {
    title: "Dokumen",
    href: "/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Pengaturan",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarVariants = {
    expanded: { width: '256px' },
    collapsed: { width: '64px' },
  };

  const mobileMenuVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobileMenu}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <motion.aside
        className="hidden md:flex h-screen bg-background border-r flex-col fixed left-0 top-0"
        initial="expanded"
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          pathname={pathname}
          handleLogout={handleLogout}
        />
      </motion.aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3 }}
          >
            <SidebarContent
              isCollapsed={false}
              toggleSidebar={toggleMobileMenu}
              pathname={pathname}
              handleLogout={handleLogout}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

interface SidebarContentProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  pathname: string;
  handleLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isCollapsed,
  toggleSidebar,
  pathname,
  handleLogout,
}) => (
  <>
    <div className="p-4 flex justify-between items-center">
      {!isCollapsed && <h2 className="text-lg font-semibold">Menu</h2>}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
    <ScrollArea className="flex-1">
      <nav className="space-y-2 p-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-muted",
                isCollapsed && "justify-center"
              )}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-2">{item.title}</span>}
            </Button>
          </Link>
        ))}
      </nav>
    </ScrollArea>
    <div className="p-4 border-t">
      <div
        className={cn(
          "flex items-center",
          isCollapsed ? "justify-center space-y-4 flex-col" : "justify-between"
        )}
      >
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  </>
);

export default Sidebar;