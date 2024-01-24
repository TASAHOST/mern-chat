import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Logo from "./Logo";
import Contact from "./Contact";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState([]);
  const { username, id, setUsername, setId } = useContext(UserContext);

  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);
  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(
        () => {
          console.log("Disconnect. Trying to connect.");
          connectToWs();
        },
        //ตรงนี้คือ timeout ที่เวลาคือ ms 1000  นี้คือ  1 วิ
        1000
      );
    });
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessage((prev) => [...prev, { ...messageData }]);
      }
    }
  };

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  useEffect(
    () => {
      axios.get("/people").then((res) => {
        const offlinePeopleArr = res.data
          .filter((p) => p._id != id)
          .filter((p) => !Object.keys(onlinePeople).includes(p._id));
        const offlinePeople = {};
        offlinePeopleArr.forEach((p) => {
          offlinePeople[p._id] = p;
        });
        setOfflinePeople(offlinePeople);
      });
    },
    //จะทำเมื่อตัวใน [] despendensylist นี่เปลี่ยนแปลง
    [onlinePeople]
  );
  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const logout = () => {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  };
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {Object.keys(onlinePeopleExclOurUser).map((userId) => (
            <Contact
              key={userId}
              username={onlinePeopleExclOurUser[userId]}
              id={userId}
              online={true}
              selected={userId === selectedUserId}
              onClick={() => setSelectedUserId(userId)}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              username={offlinePeople[userId].username}
              id={userId}
              online={false}
              selected={userId === selectedUserId}
              onClick={() => setSelectedUserId(userId)}
            />
          ))}
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
            {username}
          </span>

          <button
            className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm"
            onClick={logout}
          >
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
