
import React from 'react';

const SeatLegend: React.FC = () => {
  return (
    <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-sm">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-800/50 rounded mr-2"></div>
        <span>Standard ($12.99)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-purple-800/20 rounded mr-2"></div>
        <span>Premium ($15.99)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-purple-900/30 rounded mr-2"></div>
        <span>VIP ($18.99)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-700 rounded mr-2"></div>
        <span>Occupied</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-primary rounded mr-2"></div>
        <span>Selected</span>
      </div>
    </div>
  );
};

export default SeatLegend;
