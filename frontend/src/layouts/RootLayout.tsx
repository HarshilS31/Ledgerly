import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react"
import { Menu} from "lucide-react"
export default function RootLayout() {
  const [open,setOpen] = useState(false);
  return (
    <div className="flex h-screen gap-3 p-3">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
        className="h-fit shrink-0 self-start p-2 text-ink-soft hover:text-ink"
      >
        <Menu size={20} />
      </button>
      {open && <Sidebar />}
      <main className="min-w-0 flex-1 overflow-y-auto"><Outlet /></main>
    </div>
  );
}