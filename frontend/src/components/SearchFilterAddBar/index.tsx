import React from "react";
import PlusIcon from "../Svgs/PlusIcon";
import SearchIcon from "../Svgs/SearchIcon";

interface SearchFilterAddBarProps {
    isLeftButtonVisible?: boolean;
    isRightButtonVisible?: boolean;
    isFiltersVisible?: boolean;
    leftTextButton?: string;
    rightTextButton?: string;
    filters: string[];
    onRightButtonClick?: () => void;
    placeholderText: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    isAddPlusSign?: boolean
    isRightButtonDisabled?: boolean;
}

const SearchFilterAddBar: React.FC<SearchFilterAddBarProps> = ({
                                                                   isLeftButtonVisible = false,
                                                                   isRightButtonVisible = false,
                                                                   isFiltersVisible = false,
                                                                   leftTextButton = "",
                                                                   rightTextButton = "",
                                                                   filters = [],
                                                                   placeholderText,
                                                                   onRightButtonClick,
                                                                   searchValue,
                                                                   onSearchChange,
                                                                   isAddPlusSign = true,
                                                                   isRightButtonDisabled = false,
                                                               }) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    return (
        <div className="flex flex-1 flex-row space-x-10 justify-between px-5 pb-5 rounded-t-[0px] bg-white ">
            <div className="flex items-center">
                <div className="relative w-full max-w-md sm:max-w-sm md:max-w-lg lg:max-w-xl">
                    <input
                        type="text"
                        placeholder={placeholderText}
                        className="w-full p-3 pl-10 font-title bg-[#F8FAFC] outline-none rounded-full"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <SearchIcon/>
                </div>
            </div>

            <div className="flex justify-center ">
                {isRightButtonVisible && (
                    <button
                        className={`flex items-center font-title justify-center text-white rounded-lg p-2 text-sm md:text-base md:px-4 md:py-3 ${
                            isRightButtonDisabled
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:from-gradientBlueStart/90 hover:to-gradientBlueEnd/90"
                        }`}
                        onClick={onRightButtonClick}
                        disabled={isRightButtonDisabled}
                    >
                        {isAddPlusSign && <PlusIcon/>}
                        <span className="hidden sm:block">{rightTextButton}</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchFilterAddBar;