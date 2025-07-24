export function InputBox({
 ref,
  placeholder
}: {
  ref?:any;
  placeholder: string;
}) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={"text"}
        className="px-4 py-2 border rounded-xl m-2"
        ref={ref}
      ></input>
    </div>
  );
}