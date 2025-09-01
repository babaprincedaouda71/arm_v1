import React from "react";

const Modal = ({isOpen, onClose, title, subtitle, icon, children, actions}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-[55]">
            <div className="bg-white rounded-lg p-6 flex flex-col space-y-20 w-[400px] lg:w-[700px]">
                {/* En-tête du modal */}
                <div className="relative mb-4">
                    {/* Arrière-plan de l'en-tête */}
                    <div
                        className="absolute inset-0 bg-right bg-[url('/images/bg-modal.svg')] bg-no-repeat opacity-20"
                        style={{backgroundSize: "35% auto"}}
                    ></div>
                    <div className="flex items-center space-x-2">
                        {/* Icône personnalisée */}
                        <div className="mr-2">
                            {icon ? (
                                <div className="w-8 h-8 text-black">{icon}</div>
                            ) : (
                                // Icône par défaut
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={3.5}
                                    stroke="currentColor"
                                    className="w-8 h-8 text-black"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            )}
                        </div>
                        {/* Titre et sous titre */}
                        <div>
                            {title && <h2 className="text-xl font-bold">{title}</h2>}
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    {/* <div className="absolute top-0 right-0 h-full">
            <img src="/images/bg-modal.svg"/>
          </div> */}
                </div>
                {/* Corps du modal */}
                <div className="mb-6">{children}</div>
                {/* Pied de page du modal */}
                <div className="flex justify-around">
                    {actions &&
                        actions.map((action, index) => (
                            <button
                                key={index}
                                className={`${action.className} px-4 py-2 rounded-md`}
                                onClick={action.onClick}
                            >
                                {action.label}
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Modal;