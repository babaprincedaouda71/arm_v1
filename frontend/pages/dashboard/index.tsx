import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={false} />
      <div className="flex flex-col flex-1">
        <Header
          onMenuClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <MainContent />
      </div>
      <Footer />
    </div>
  );
}