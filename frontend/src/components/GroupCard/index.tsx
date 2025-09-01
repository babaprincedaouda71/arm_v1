// components/GroupCard.js
export default function GroupCard({
    groupName = "Groupe 1",
    date = "01/01/2024",
    participants = "0 participants",
    company = "Entreprise",
    amount = "0,00 DH",
    name = "Nom complet",
  }) {
    return (
      <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-200 flex ml-3 mb-32">
        {/* Section gauche avec rotation */}
        <div className="bg-green-500 text-white flex items-center justify-center w-12 rounded-tl-xl rounded-bl-xl">
          <div className="transform -rotate-90 whitespace-nowrap text-lg font-bold">
            {groupName}
          </div>
        </div>
  
        {/* Section principale */}
        <div className="flex-grow p-4">
          {/* Icône du document en haut à droite */}
          <div className="flex justify-end">
            <div className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4h16v16H4V4z"
                />
              </svg>
            </div>
          </div>
  
          {/* Contenu principal */}
          <div className="mt-4 space-y-2 text-center">
            <p className="text-gray-700 font-medium text-lg">{date}</p>
            <p className="text-gray-700">{participants}</p>
            <p className="text-gray-700 font-semibold text-lg">{company}</p>
            <p className="text-gray-700 font-bold text-lg">{amount}</p>
            <p className="text-gray-700 font-medium">{name}</p>
          </div>
        </div>
      </div>
    );
  }
  