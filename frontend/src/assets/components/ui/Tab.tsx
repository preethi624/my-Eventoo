import React, { useState } from "react";

type TabProps = {
  tabs: { label: string; value: string }[];
  defaultValue: string;
  children: React.ReactNode;
};

export const Tabs: React.FC<TabProps> = ({ tabs, defaultValue, children }) => {
  const [active, setActive] = useState(defaultValue);

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`px-4 py-2 rounded ${
              active === tab.value
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {React.Children.map(children, (child: any) =>
          child.props.value === active ? child : null
        )}
      </div>
    </div>
  );
};

export const TabsContent: React.FC<{ value: string; children: React.ReactNode }> =
  ({ children }) => <div>{children}</div>;
