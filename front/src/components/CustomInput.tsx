import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const CustomInput = ({
  className,
  classNameInput,
  ...props
}: {
  classNameInput?: string;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className={clsx("w-full relative ", className)}>
      <input
        {...props}
        value={props.value ?? ""}
        className={clsx(
          "bg-white",
          classNameInput,
          "z-20 outline-none border-2 rounded-md border-green-500",
          "cursor-default border-b-2 p-2 border-green-300 h-12 hover:border-green-400 focus:outline-none focus:border-2 focus:border-green-400 focus:rounded-md hover:rounded-md w-full",
          props.disabled
            ? "hover:border-none border-none bg-gray-50!"
            : "hover:border-2",
        )}
      />
    </div>
  );
};
