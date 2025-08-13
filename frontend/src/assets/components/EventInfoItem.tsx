
import React from 'react';

interface Props {
  icon: React.ReactNode;
  label: string;
}

const EventInfoItem: React.FC<Props> = ({ icon, label }) => (
  <div className="flex items-center text-lg text-gray-700 mb-2">
    <span className="mr-3 text-black">{icon}</span>
    {label}
  </div>
);

export default EventInfoItem;
