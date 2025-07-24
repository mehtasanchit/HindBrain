
import { BrainIcon } from "../icons/BrainIcon";
import { TwitterSymbol } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./sidebaritem";

export function SideBar(){
    return <div className="fixed top-0 left-0 h-screen w-76  bg-white pl-6">
        <div className="flex text-3xl pt-8 font-bold items-center">
            <div className="flex  pr-2 text-purple-600">
                <BrainIcon/>
            </div>
            HindBrain
        </div>
        <div className="pt-8 pl-4">
            <SidebarItem text="Twitter" icon={<TwitterSymbol/>}></SidebarItem>
            <SidebarItem text="Youtube" icon={<YoutubeIcon/>}></SidebarItem>
        </div>
    </div>
}