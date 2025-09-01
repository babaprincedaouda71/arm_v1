// pages/IndividualRequest.tsx
import React, {useState} from "react";
// import { pagination, totalRecords, userData } from "../../userData";

const IndividualRequest = () => {
    const [isDashboard, setIsDashboard] = useState(true);

    const handleToggle = () => {
        setIsDashboard(!isDashboard);
    };

    const filter = ["Type", "Plan", "Site", "Development"];

    return (
        <div className="bg-[#F0F0F0] pt-5 px-5 w-full">
            {/*<div className=" ">*/}
            {/*  <ToggleButton*/}
            {/*    isDashboard={isDashboard}*/}
            {/*    toggleTextButton="INDIVIDUAL REQUEST"*/}
            {/*    handleToggle={handleToggle}*/}
            {/*  />*/}
            {/*</div>*/}
            {/*{isDashboard ? (*/}
            {/*  <>*/}
            {/*    <div className="flex flex-wrap justify-center mt-5 space-x-4 w-full">*/}
            {/*      <div className="w-full sm:w-[57.45%] h-[427.56px] rounded-[8px] bg-white px-10 flex flex-col justify-center items-start shadow-md mb-4 sm:mb-0">*/}
            {/*        <div className="border-b-[1.22px] pb-4 border-[#E5E5EF] w-full pt-[28px]">*/}
            {/*          <h1 className="text-[22px] text-[#1E1B39] font-[600] ">*/}
            {/*            Departments*/}
            {/*          </h1>*/}
            {/*        </div>*/}
            {/*        <DepartmentChart />*/}
            {/*      </div>*/}
            {/*      <div className="w-full sm:w-[41%] h-[427.1px] bg-white rounded-[8px] px-10 flex justify-center items-center shadow-md">*/}
            {/*        <DepartmentDoughnutChart />*/}
            {/*      </div>*/}
            {/*    </div>*/}

            {/*    <div>*/}
            {/*      /!*<SearchFilterAddBar*!/*/}
            {/*      /!*  isLeftButtonVisible={true}*!/*/}
            {/*      /!*  isFiltersVisible={true}*!/*/}
            {/*      /!*  isRightButtonVisible={true}*!/*/}
            {/*      /!*  leftTextButton="New Theme"*!/*/}
            {/*      /!*  rightTextButton="Add User"*!/*/}
            {/*      /!*  filters={filter}*!/*/}
            {/*      /!*//*/}
      {/*    </div>*/}
            {/*    <div>*/}
            {/*      <Table*/}
            {/*        data={userData.map((item) => ({*/}
            {/*          dataItems: {*/}
            {/*            ...item.dataItems,*/}

            {/*            fullName: (*/}
            {/*              <div className="flex justify-center items-center">*/}
            {/*                <img*/}
            {/*                  src="/images/user-image.png"*/}
            {/*                  alt="Full Name"*/}
            {/*                  className="w-10 h-10 rounded-full"*/}
            {/*                />*/}
            {/*                <div className="flex flex-col ml-2 text-left">*/}
            {/*                  <span>Danish</span>*/}
            {/*                  <span>danish@gmail.com</span>*/}
            {/*                </div>*/}
            {/*              </div>*/}
            {/*            ),*/}
            {/*            status: (*/}
            {/*              <div className=" flex  justify-center items-center">*/}
            {/*                <div className=" py-[8px] px-[10px] rounded-lg  bg-[#FFE167] ">*/}
            {/*                  Active*/}
            {/*                </div>*/}
            {/*              </div>*/}
            {/*            ),*/}
            {/*            action: (*/}
            {/*              <div className="flex  justify-center items-center">*/}
            {/*                <div className="flex space-x-4">*/}
            {/*                  <EditIcon className="cursor-pointer" />*/}
            {/*                  <DeleteIcon className="cursor-pointer" />*/}
            {/*                </div>*/}
            {/*              </div>*/}
            {/*            ),*/}
            {/*          },*/}
            {/*        }))}*/}
            {/*        keys={["fullName", "group", "creationDate", "status", "action"]}*/}
            {/*        headers={[*/}
            {/*          "FullName",*/}
            {/*          "Group",*/}
            {/*          "Creation Date",*/}
            {/*          "Status",*/}
            {/*          "Action",*/}
            {/*        ]}*/}
            {/*        sort="asc"*/}
            {/*        sortable={true}*/}
            {/*        onSort={(key: string, order: string) =>*/}
            {/*          console.log("Sort by:", key, "Order:", order)*/}
            {/*        }*/}
            {/*        isPagination={true}*/}
            {/*        pagination={pagination}*/}
            {/*        totalRecords={totalRecords}*/}
            {/*        loading={false}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  </>*/}
            {/*) : (*/}
            {/*  <div className="mt-5">*/}
            {/*    <InvidualRequestForm />*/}
            {/*  </div>*/}
            {/*)}*/}
        </div>
    );
};

export default IndividualRequest;