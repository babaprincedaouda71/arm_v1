import React, {useState} from "react";
import DepartmentCard from "../DepartmentCard";
import dynamic from "next/dynamic";
import ChartIcon from "@/components/Svgs/ChartIcon";

const DonutChart = dynamic(() => import('@/components/DonutChart'), {
    ssr: false
});

const DashboardBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleBar = () => {
        setIsOpen(!isOpen);
    };

    const departmentsData = [
        {name: 'Ingénierie', count: 10},
        {name: 'IT', count: 20},
        {name: 'Marketing', count: 6},
        {name: 'Sécurité', count: 5}
    ];

    // const data = [
    //   { id: "02", value: 20 },
    //   { id: "03", value: 25 },
    //   { id: "04", value: 25 },
    //   { id: "05", value: 30 }
    // ];

    const departmentData = [
        {name: 'IT', value: 10,},         // Rouge
        {name: 'Marketing', value: 4,},  // Bleu clair
        {name: 'Ingénierie', value: 3,}, // Violet
        {name: 'Sécurité', value: 2,}    // Bleu très clair
    ];

    const data = [3, 5, 4, 5];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    const total = 10;


    return (
        <div className="w-full mb-4">
            {/* Barre interactive */}
            <div
                className="flex items-center justify-between bg-white hover:bg-slate-100 p-2 cursor-pointer rounded-full mb-4"
                onClick={toggleBar}
            >
                <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center">
                        {/* Icône */}
                        <ChartIcon/>
                    </div>
                    <span
                        className="text-xl font-extrabold bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-transparent bg-clip-text">
            Rapport
          </span>
                </div>
                {/* Chevron */}
                <div>
                    {isOpen ? (
                        <img src="/images/chevronRight.svg" className="h-5 w-5"/>
                    ) : (
                        <img src="/images/chevronDown.svg" className="h-5 w-5"/>
                    )}
                </div>
            </div>

            {/* Contenu déroulant avec transition */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-[3.5]">
                        <DepartmentCard departments={departmentsData}/>

                    </div>
                    {/* <DepartmentsChart departments={departments} /> */}
                    <div className="flex-[3] min-h-[300px]">
                        <DonutChart
                            data={departmentData}
                            totalLabel="Départements"
                        />
                    </div>
                    {/*<DepartmentsDonut departments={departments} />*/}
                </div>
            </div>
        </div>
    );
};

export default DashboardBar;