import React from "react";
import classNames from "classnames";

interface ToggleButtonProps {
  isDashboard: boolean;
  toggleTextButton: string;
  handleToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isDashboard,
  toggleTextButton,
  handleToggle,
}) => {
  return (
    <div
      className="flex justify-between items-center w-[30.7%]  space-x-1 h-14 p-[8px] bg-gray-200 rounded-[20px] bg-white cursor-pointer"
      onClick={handleToggle}
    >
      <div
        className={classNames(
          "flex justify-center items-center w-[38.6%] h-[40px] rounded-[20px]",
          {
            "bg-yellow-300": isDashboard,
            "bg-transparent": !isDashboard,
          }
        )}
      >
        <span
          className={classNames("text-[15px] font-[600]", {
            "text-black": isDashboard,
            "text-gray-500": !isDashboard,
          })}
        >
          DASHBOARD
        </span>
      </div>
      <div
        className={classNames(
          "flex justify-center items-center w-[50.0%] h-[40px] rounded-[20px]",
          {
            "bg-yellow-300": !isDashboard,
            "bg-transparent": isDashboard,
          }
        )}
      >
        <span
          className={classNames("text-[15px] font-[600]", {
            "text-black": !isDashboard,
            "text-gray-500": isDashboard,
          })}
        >
          {toggleTextButton}
        </span>
      </div>
    </div>
  );
};

export default ToggleButton;
