import { useRef, useState } from "react";
import { CrossIcon } from "../icons/Crossicon";
import { Button } from "./button";
import { InputBox } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../config";

//@ts-ignore
enum ContentTypes {
  YouTube = "youtube",
  Twitter = "twitter",
}

export function CreateContentModal({ open, onClose }:any) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentTypes.YouTube);
  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    await axios.post(`${BACKEND_URL}/api/v1/content`,{
      link,
      title,
      type
    },{
      headers:{
        authorization:localStorage.getItem("token")
      }
    })

    onClose();
  }
  return (
    <div>
      {open && (
        <div>
          <div className="bg-slate-500 w-screen h-screen fixed top-0 left-0 opacity-60 flex justify-center"></div>
          
           {/* trasparent bg of this div */}
          <div className="w-screen h-screen fixed top-0 left-0  flex justify-center">  
            <div className="flex flex-col justify-center">
              <span className="bg-white opacity-100 p-4 rounded-2xl">
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer">
                    <CrossIcon></CrossIcon>
                  </div>
                </div>
                <div>
                  <InputBox placeholder={"Title"} ref={titleRef} />
                  <InputBox placeholder={"Link"} ref={linkRef} />
                </div>
                <div>
                  <h1>Types</h1>
                  <div className="flex gap-1 p-4">
                    <Button
                      text="Youtube"
                      variant={
                        type === ContentTypes.YouTube ? "primary" : "secondary"
                      }
                      onClick={() => setType(ContentTypes.YouTube)}
                    />
                    <Button
                      text="Twitter"
                      variant={
                        type === ContentTypes.Twitter ? "primary" : "secondary"
                      }
                      onClick={() => setType(ContentTypes.Twitter)}
                    />
                  </div>
                </div>
                <div className="flex justify-center pt-1">
                  <Button onClick={addContent} variant="primary" text="Submit" />
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
