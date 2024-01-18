import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Logo from "./Logo";
import Contact from "./Contact";

const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          <Contact
            username={"PPyz"}
            id={"65a8c085a80d42b1d99026d7"}
            online={true}
            selected={false}
          />
          <Contact
            username={"F Titadach"}
            id={"65a8c073a80d42b1d99026d5"}
            online={false}
            selected={false}
          />
          <Contact
            username={"Aom Yet He"}
            id={"65a79a874a44649481de5fe3"}
            online={true}
            selected={true}
          />
        </div>
        <div className="p-2 text-center flex item-center justify-center ">
          <span className="mr-2 text-sm text-gray-600 flex item-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Username
          </span>

          <button className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm">
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          <div className="flex h-full flex-grow items-center justify-center">
            <div className="text-gray-300">
              &larr;Select a person from sidebar
            </div>
          </div>
        </div>
        <form className="flex gap-2">
          <input
            type="text"
            placeholder="Type You Message"
            className="bg-white flex-grow border rounded-sm p-2"
          />
          <label
            htmlFor=""
            className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200"
          >
            <input type="file" name="" id="" className="hidden" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              />
            </svg>
          </label>
          <button
            type="submit"
            className="bg-blue-500 p-2 text-white rounded-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
