
import type { ReactElement } from "react"

interface Buttonprops{
    variant:"primary"|"secondary",
    text:string,
    starticon?:ReactElement,
    onClick?:()=>void,
    fullwidth?:boolean,
    loading?:boolean
}

const variantclasses={
    "primary":"bg-purple-600 text-white",
    "secondary":"bg-purple-200 text-purple-600"
}

const defaultstyles=" px-4 py-2 rounded-md  font-light  flex items-center  ";

export function Button({ variant, text, starticon, onClick, fullwidth, loading }: Buttonprops) {
    return (
        <button
            className={`${variantclasses[variant]} ${defaultstyles} ${fullwidth ? "w-full flex justify-center items-center" : ""} ${loading ? "opacity-45 cursor-not-allowed" : "hover:cursor-pointer"}`}
            onClick={onClick}
            disabled={loading}
        >
            <div className="pr-2">
                {starticon}
            </div>
            {text}
        </button>
    );
}
