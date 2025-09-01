import React from "react";
import ManualEntry from "@/components/ManualEntry";
import ProtectedRoute from "@/components/ProtectedRoute";

const index = () => {
    return (
        <ProtectedRoute>
            <div className="font-title text-xs md:text-sm py-4 lg:text-base bg-white rounded-t-xl">
                {/*<BreadcrumbNav/>*/}
                <ManualEntry/>
            </div>
        </ProtectedRoute>
    );
};

export default index;