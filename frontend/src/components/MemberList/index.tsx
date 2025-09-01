import React from 'react';

const members = [
  { name: 'Sumayyah', active: true },
  { name: 'Niyyah', active: false },
  { name: 'Salwa', active: false },
  { name: 'James', active: false },
];

const MemberList = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[16%]">
      <h2 className="text-lg font-semibold mb-4">Member List</h2>
      <ul>
        {members.map((member, index) => (
          <li
            key={index}
            className={`flex items-center py-2 px-4 rounded-lg mb-2 ${member.active ? 'bg-yellow-100' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full bg-gray-300 ${member.active ? 'border-2 border-yellow-500' : ''}`}></div>
            <span className="ml-4 flex-grow">{member.name}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
