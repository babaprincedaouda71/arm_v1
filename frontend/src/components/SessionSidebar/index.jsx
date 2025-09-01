import Link from "next/link";

const SessionSidebar = () => {
  return (
    <nav className="flex justify-center py-10 w-1/6 text-gray-500 border border-t-0 border-b-2 rounded-xl">
      <ul>
        <li>
          <Link
            className="flex items-center hover:bg-primary hover:text-lg py-3 px-16 hover:text-black"
            href="/session/planification"
          >
            Planification
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center hover:bg-primary hover:text-lg py-3 px-16 hover:text-black"
            href="/session/participants"
          >
            Participants
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center hover:bg-primary hover:text-lg py-3 px-16 hover:text-black"
            href="/session/provider"
          >
            Provider
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center hover:bg-primary hover:text-lg py-3 px-16 hover:text-black"
            href="#"
          >
            Evaluation
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center hover:bg-primary hover:text-lg py-3 px-16 hover:text-black"
            href="#"
          >
            Accounting
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center hover:bg-primary hover:text-lg py-3 px-16 hover:text-black"
            href="#"
          >
            Library
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SessionSidebar;
