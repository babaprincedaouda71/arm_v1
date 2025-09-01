import React from "react";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const NewModelButton = ({questionnaireType}) => {
    const {navigateTo} = useRoleBasedNavigation()
    const handleAdd = () => {
        navigateTo("/evaluation/add", {
            query: {
                questionnaireType: questionnaireType
            }
        })
    };
    return (
        <button
            onClick={handleAdd}
            className="mt-2 py-2 px-4 font-bold text-primary bg-[#5a62dd25] rounded-lg hover:bg-violet-100"
        >
            Nouveau modèle
        </button>
    );
};

export default NewModelButton;