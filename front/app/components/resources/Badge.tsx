import * as React from "react";
import { FaHashtag } from "react-icons/fa";

type BadgeProps = {
  label: string;
};

const Badge: React.FC<BadgeProps> = ({ label }) => {
  return (
    <div className="absolute z-10 bottom-[-10px] right-[-10px]">
      <div className="relative flex items-center">
        <div className="absolute inset-0 bg-gray-500 transform -skew-x-12 rounded-lg"></div>
        <div className="relative pt-2 pb-4 px-4 flex items-center">
          <FaHashtag className="text-white mr-1 z-10" />
          <span className="font-bold text-white text-xs tracking-wider z-10">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Badge;
