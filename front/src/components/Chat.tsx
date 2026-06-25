import { CustomInput } from "@/components/CustomInput";
import { Message } from "@/components/Message";
import axios, { AxiosError } from "axios";
import clsx from "clsx";
import { SubmitEvent, useEffect, useRef, useState } from "react";

interface IMessage {
  provider: "user" | "assistant";
  content: string;
  id: string;
}

const send = (
  <svg
    width="30px"
    height="30px"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5 0.5L14.9596 0.69696C15.0401 0.509038 14.9981 0.291016 14.8536 0.146447C14.709 0.00187701 14.491 -0.0401102 14.303 0.0404275L14.5 0.5ZM0.5 6.5L0.30304 6.04043C0.130457 6.11439 0.0138614 6.27881 0.00114754 6.46614C-0.0115663 6.65348 0.0817453 6.83214 0.242752 6.92875L0.5 6.5ZM8.5 14.5L8.07125 14.7572C8.16786 14.9183 8.34652 15.0116 8.53386 14.9989C8.72119 14.9861 8.88561 14.8695 8.95957 14.697L8.5 14.5ZM14.303 0.0404275L0.30304 6.04043L0.69696 6.95957L14.697 0.959573L14.303 0.0404275ZM0.242752 6.92875L5.24275 9.92875L5.75725 9.07125L0.757248 6.07125L0.242752 6.92875ZM5.07125 9.75725L8.07125 14.7572L8.92875 14.2428L5.92875 9.24275L5.07125 9.75725ZM8.95957 14.697L14.9596 0.69696L14.0404 0.30304L8.04043 14.303L8.95957 14.697ZM14.1464 0.146447L5.14645 9.14645L5.85355 9.85355L14.8536 0.853553L14.1464 0.146447Z"
      fill="#000000"
    />
  </svg>
);

export const Chat = () => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      setMessages((messages) => [
        ...messages,
        {
          content: message,
          id: `${messages.length}user`,
          provider: "user",
        },
      ]);
      const response = await axios.post<{ response: string }>(
        `${process.env.NEXT_PUBLIC_HOST}/chatBot`,
        {
          message,
        },
      );
      const newMessage =
        response.data.response ?? "No se ha encontrado información";
      setMessages((messages) => [
        ...messages,
        {
          content: newMessage,
          id: `${messages.length}assistant`,
          provider: "assistant",
        },
      ]);
      setMessage("");
    } catch (err) {
      const error = err as Error | AxiosError;
      setMessages((messages) => [
        ...messages,
        {
          content: `Ha ocurrido un error: ${error.message}`,
          id: `${messages.length}assistant`,
          provider: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const disableForm = !message || isLoading;
  return (
    <div className="flex flex-col gap-2 relative h-full">
      <div className="flex flex-col h-full lg:max-h-10/12 xl:max-h-11/12 w-full overflow-y-auto p-4 ">
        {messages.map(({ content, provider, id }, i) => (
          <Message
            key={`${id}${i}`}
            fromUser={provider === "user"}
            text={content}
          />
        ))}
        <div ref={bottomRef} />
        {isLoading && <TypingIndicator />}
      </div>
      <div className="flex flex-col w-full">
        <button
          className="hover:underline text-xs cursor-pointer text-blue-500"
          title="Limpiar chat"
          onClick={() => setMessages([])}
        >
          Limpiar mensajes
        </button>
        <form
          onSubmit={sendMessage}
          className="flex flex-row gap-2 max-h-12 items-center w-full"
        >
          <CustomInput
            type="text"
            placeholder="Por ejemplo: ¿Vendes Iphone?"
            onChange={({ target: { value } }) => setMessage(value)}
            value={message}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={disableForm}
            className={clsx(
              "bg-green-200  p-1 flex justify-center items-center h-10 w-10 rounded shadow ",
              disableForm ? "bg-gray-200!" : "hover:bg-green-300",
            )}
          >
            {send}
          </button>
        </form>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-2 mt-2 self-center">
    <span className="text-gray-500 text-lg select-none">Pensando</span>
    <span className="flex space-x-1">
      <span className="animate-bounce [animation-delay:-0.3s] w-2 h-2 bg-gray-400 rounded-full" />
      <span className="animate-bounce [animation-delay:-0.15s] w-2 h-2 bg-gray-400 rounded-full" />
      <span className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" />
    </span>
  </div>
);
