// components/ProfileCard.tsx
import React from 'react';
import Image from 'next/image';
import {FiBook, FiBriefcase} from "react-icons/fi";
import {MyProfileProps} from "@/types/dataTypes";

interface Props {
    user: MyProfileProps;
}

const ProfileCard: React.FC<Props> = ({user}) => {
    return (
        <div
            className="flex items-center gap-4 p-6 mb-6 rounded-xl bg-gradient-to-r from-gradientBlueStart to-gradientBlueEnd text-white shadow-md">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                {/* Avatar ou illustration */}
                <Image
                    src={"/default-avatar.png"} // à remplacer par le bon champ
                    alt="avatar"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1">
                <h2 className="text-xl font-bold">{user.personalInfos.fullName}</h2>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                        <FiBriefcase/>
                        <span>{user.professionalInfos.position}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiBook/>
                        <span>{user.professionalInfos.department}</span>
                    </div>
                </div>
                <span
                    className="inline-block mt-3 bg-white text-purple-700 text-xs px-2 py-1 rounded-full font-semibold">
          Niveau 3 {""}
        </span>
            </div>
        </div>
    );
};

export default ProfileCard;