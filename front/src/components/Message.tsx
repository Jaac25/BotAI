import clsx from "clsx";
import ReactMarkdown from "react-markdown";

export const Message = ({
  text,
  fromUser,
}: {
  text: string;
  fromUser: boolean;
}) => {
  return (
    <div
      className={clsx("flex mb-2", fromUser ? "justify-end" : "justify-start")}
    >
      <div
        className={clsx(
          "px-4 py-2 rounded-lg shadow max-w-72",
          "wrap-break-word! overflow-hidden text-gray-900",
          //whitespace-pre-wrap
          fromUser
            ? "bg-green-200 rounded-br-none"
            : "bg-gray-200 rounded-bl-none",
        )}
      >
        <ReactMarkdown>
          {text.replace(/(\|.*\|\n)(\|[-:\s|]+\|\n)((\|.*\|\n?)*)/g, "")}
        </ReactMarkdown>
      </div>
    </div>
  );
};
