import axios from "axios";
import { Button } from "../components/button";
import { InputBox } from "../components/Input";
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const UsernameRef=useRef<HTMLInputElement>(null);
  const passwordRef=useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  async function signin(){
    const username=UsernameRef.current?.value;
    const password=passwordRef.current?.value;
    const response=await axios.post(BACKEND_URL+"/api/v1/signin",{
      username,
      password
    })
    const jwt=response.data.token;
    localStorage.setItem("token",jwt);
    navigate("/dashboard");
  }
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center p-8">
      <div className="bg-white rounded-2xl border-amber-50  min-w-48 p-8">
        <InputBox placeholder="Username" ref={UsernameRef}/>
        <InputBox placeholder="password" ref={passwordRef}/>

        <div className="flex justify-center pt-4">
            <Button variant="primary" text="LogIn" fullwidth={true} loading={false} onClick={signin}/>
        </div>
      </div>
    </div>
  );
}