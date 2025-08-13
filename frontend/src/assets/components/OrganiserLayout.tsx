import React from "react";
import type { ReactNode } from "react";

import OrganiserNavbar from "./OrganiserNavbar";
import OrganiserSidebar from "./OrganiserSidebar";

interface LayoutProps {
  children: ReactNode;
}

const OrganiserLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <OrganiserSidebar />

      <div className="ml-[250px] w-[calc(100%-250px)]">
        <OrganiserNavbar />
        <main className="p-5 mt-[60px]">{children}</main>
      </div>
    </div>
  );
};

export default OrganiserLayout;
