import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/solid';

const notifications = [
  { id: 1, name: 'Danish Logged In', time: '10 minutes ago', image: '/path/to/avatar1.png' },
  { id: 2, name: 'Danish Logged In', time: '10 minutes ago', image: '/path/to/avatar2.png' },
  { id: 3, name: 'Danish Logged In', time: '10 minutes ago', image: '/path/to/avatar3.png' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const NotificationPopup = () => {
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 text-lg font-semibold">Notification</div>
            {notifications.map((notification) => (
              <Menu.Item key={notification.id}>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'flex items-center px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    <img
                      src={notification.image}
                      alt="avatar"
                      className="h-6 w-6 rounded-full mr-3"
                    />
                    <div>
                      <div>{notification.name}</div>
                      <div className="text-xs text-gray-500">{notification.time}</div>
                    </div>
                  </div>
                )}
              </Menu.Item>
            ))}
            <div className="px-4 py-2">
              <button className="w-full text-center py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                See all notification
              </button>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationPopup;
