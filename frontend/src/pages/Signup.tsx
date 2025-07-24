import { useRef } from "react";
import { Button } from "../components/button";
import { InputBox } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const UsernameRef=useRef<HTMLInputElement>(null);
  const passwordRef=useRef<HTMLInputElement>(null);
  const navigate=useNavigate();

  async function signup(){
    const username=UsernameRef.current?.value;
    const password=passwordRef.current?.value;
    await axios.post(BACKEND_URL+"/api/v1/signup",{
      username,
      password
    })
    navigate("/signin");
    alert("You have signed up");
  }
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center p-8">
      <div className="bg-white rounded-2xl border-amber-50  min-w-48 p-8">
        <InputBox placeholder="Username" ref={UsernameRef} />
        <InputBox placeholder="password" ref={passwordRef}/>

        <div className="flex justify-center pt-4">
            <Button variant="primary" text="Sign Up" fullwidth={true} loading={false} onClick={signup}/>
        </div>
      </div>
    </div>
  );
}
