import React from "react";
import SessionChart from "../src/components/Sesssion";
import DepartmentCard from "@/components/DepartmentCard";
import ProtectedRoute from "@/components/ProtectedRoute";

const Home = () => {
    const departmentsData = [
        {name: 'Ingénierie', count: 10},
        {name: 'IT', count: 20},
        {name: 'Marketing', count: 6},
        {name: 'Sécurité', count: 5}
    ];

    return (
        <>
            <ProtectedRoute>
                <div className=" flex md:flex-row flex-col gap-2 justify-between">
                    {/* <DepartmentsChart departments={departments} /> */}
                    <DepartmentCard departments={departmentsData}/>
                    <SessionChart/>
                </div>
                <div>
                    <DepartmentCard departments={departmentsData}/>
                </div>
            </ProtectedRoute>
        </>
    );
};

export default Home;