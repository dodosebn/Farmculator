import UseLogo from "@/hooks/useLogo";
import { FiSidebar } from "react-icons/fi";

const GenPage = () => {
  return (
    <div>
        <div className="flex gap-10">
            <div><UseLogo /></div>
            <div><FiSidebar size={32}/>
</div>
<button>New Chat</button>
        </div>
    </div>
  )
}

export default GenPage;