import React from 'react';

const scheduleData = [
  { name: 'Sumayyah', task: 'Meeting with Developers' },
  { name: 'Niyyah', task: 'Marketing Strategy Presentation' },
  { name: 'Salwa', task: 'Customer Feedback Analysis' },
  { name: 'James', task: 'Budget Planning' },
];

const Schedule = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[30%]">
      <h2 className="text-lg font-semibold mb-4">Schedule</h2>
      <ul>
        {scheduleData.map((item, index) => (
          <li key={index} className="flex items-center py-2">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="ml-4">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">{item.task}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
