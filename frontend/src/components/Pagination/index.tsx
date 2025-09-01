import React from "react";
import ChevronBack from "../Svgs/ChevronBack";
import ChevronNext from "../Svgs/ChevronNext";
import PlaybackIcon from "../Svgs/PlaybackIcon";
import PlayForwardIcon from "../Svgs/PlayForwardIcon";


const Pagination = ({
  pageDetails,
  currentPage = 1,
  setCurrentPage,
}: typeof Pagination) => {
  const classes = (page: number) => {
    if (page === currentPage)
      return `bg-[#F6F7F9] text-[#0B41A8] text-[14px] text-bold px-[9px] py-[5px] rounded cursor-pointer mr-[16px] ${
        currentPage === 1 ? "ml-[16px]" : ""
      }`;
    return "text-[#748092] text-[14px] px-[9px] py-[5px] cursor-pointer mr-[16px]";
  };
  function pagination(currentPage: number, nrOfPages: number) {
    let delta = 2,
      range = [],
      rangeWithDots = [],
      l: number;

    range.push(1);

    if (nrOfPages <= 1) {
      return range;
    }

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < nrOfPages && i > 1) {
        range.push(i);
      }
    }
    range.push(nrOfPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(". . .");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  return pageDetails.totalPages > 1 ? (
    <div className="flex m-w-[20%] items-center">
      <PlaybackIcon onClick={() => setCurrentPage(1)} />
      {pageDetails.previousPage != null && (
        <div className="ml-[40px] mr-[26px]">
          <ChevronBack
            className="cursor-pointer"
            width="5"
            height="14"
            strokeWidth={2.5}
            onClick={() => setCurrentPage(pageDetails.currentPage - 1)}
          />
        </div>
      )}
      {pagination(pageDetails.currentPage, pageDetails.totalPages).map((item) =>
        item !== ". . ." ? (
          <p
            className={classes(item)}
            key={item}
            onClick={() => {
              setCurrentPage(item);
            }}
          >
            {item}
          </p>
        ) : (
          <p className={classes(item)} key={item}>
            {item}
          </p>
        )
      )}
      {pageDetails.nextPage != null && (
        <div className="ml-[10px] mr-[40px]">
          <ChevronNext
            className="cursor-pointer"
            width="5"
            height="14"
            strokeWidth={2.5}
            onClick={() => setCurrentPage(pageDetails.currentPage + 1)}
          />
        </div>
      )}
      <PlayForwardIcon onClick={() => setCurrentPage(pageDetails.totalPages)} />
    </div>
  ) : null;
};

export default Pagination;
