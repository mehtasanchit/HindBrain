import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { CreateContentModal } from "../components/CreateContentModal";
import { Plus } from "../icons/Plusicon";
import { Share } from "../icons/shareicon";
import { SideBar } from "../components/sidebar";
import { UseContent } from "../hooks/UseContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function Dashboard() {
  const [ModalOpen, setModalOpen] = useState(false);
  const {contents,refresh} = UseContent();

  useEffect(()=>{
    refresh()
  },[ModalOpen]);

  let shareurl;
    async function handleCopy(shareurl:string){
    try {
      await navigator.clipboard.writeText(shareurl);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div>
      <SideBar />

      <div className="p-4 ml-76 min-h-screen  bg-gray-100 ">
        <CreateContentModal
          open={ModalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            text="Share Brain"
            starticon={<Share />}
            onClick={async ()=>{
              const response=await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
                share:true
              },{
                headers:{
                  "authorization":localStorage.getItem("token")
                }
              });

              shareurl=response.data.link;
              handleCopy(shareurl);
            }}
          ></Button>
          <Button
            variant="primary"
            text="Add content"
            starticon={<Plus/>}
            onClick={() => {
              setModalOpen(true);
            }}
          ></Button>
        </div>
        <div className="flex gap-4 flex-wrap">
          {contents.map(({ title, link, type }) => (
            <Card
              type={type}
              title={title}
              link={link}
            ></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
