// components/MainContent.js
import Agenda from "../Calendar"
import DepartmentsChart from "../Departement"
import MemberList from "../MemberList"
import Schedule from "../Schedule"
import SessionChart from "../Sesssion"

const MainContent = () => {
  return (
    <main className="flex-grow w-[80%] ml-[18%] mr-[1%] mt-[5%] mb-[1%]" style={{ height: 'calc(100vh - 15rem)' }}>
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between mb-5 h-1/2">
          <DepartmentsChart departments={undefined} />
          <SessionChart />
        </div>
        <div className="flex flex-row justify-between h-1/2">
          <MemberList />
          <Agenda />
          <Schedule />
        </div>
      </div>
    </main>
  )
}

export default MainContent
