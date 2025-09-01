import React from 'react';

const events = [
  {
    time: '1:00 PM',
    title: 'Marketing Strategy Presentation',
    location: 'London, United Kingdom',
    category: 'Marketing',
    active: true,
  },
  {
    time: '2:30 PM',
    title: 'Marketing Strategy Presentation',
    location: 'London, United Kingdom',
    category: 'Marketing',
    active: false,
  },
  {
    time: '1:00 PM',
    title: 'Customer Feedback Analysis',
    location: 'London, United Kingdom',
    category: 'Customer Support',
    active: true,
  },
];

const Agenda = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-[52%]">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-500">
          <span>JULY</span> <span className="font-semibold">2024</span>
        </div>
        <div className="flex space-x-2">
          <button className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">Day</button>
          <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full">Week</button>
          <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full">Month</button>
        </div>
      </div>
      <div className="overflow-y-auto h-60">
        {events.map((event, index) => (
          <div key={index} className={`flex items-start mb-4 p-3 rounded-lg ${event.active ? 'bg-yellow-50' : ''}`}>
            <div className="w-1/6 text-sm text-gray-600">{event.time}</div>
            <div className="w-5/6">
              <div className="font-semibold">{event.title}</div>
              <div className="text-sm text-gray-500">{event.location}</div>
              <div className="text-xs text-gray-400 mt-1">{event.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agenda;
