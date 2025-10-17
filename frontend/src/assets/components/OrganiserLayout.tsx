// OrganiserLayout.tsx
import React, { useState, type ReactNode } from "react";
import OrganiserNavbar from "./OrganiserNavbar";
import OrganiserSidebar from "./OrganiserSidebar";

interface LayoutProps {
  children: ReactNode;
}

const OrganiserLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen text-white bg-transparent overflow-hidden">
      {/* Sidebar */}
      <OrganiserSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-transparent">
        {/* Navbar */}
        <OrganiserNavbar setSidebarOpen={setSidebarOpen} />

        {/* Main area */}
        <main className="mt-16 p-6 flex-1 overflow-auto bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OrganiserLayout;
