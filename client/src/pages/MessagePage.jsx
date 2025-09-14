import { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import { assets } from "../assets/assets";

function MessagePage() {
  const { userProfile, token, backendUrl } = useContext(ProjectContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  const location = useLocation();
  const { authorId: openChatUserId, authorName } = location.state || {};

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!token || !userProfile?._id) return;

    const eventSource = new EventSource(
      `${backendUrl}/api/messages/sse?token=${token}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return; // skip initial msg

        // Update messages if chat is open
        if (
          selectedChat &&
          (data.from_user_id._id === getOtherUser(selectedChat)._id ||
            data.to_user_id._id === getOtherUser(selectedChat)._id)
        ) {
          setMessages((prev) => [...prev, data]);
        }

        // Update recent chats
        const otherUser =
          data.from_user_id._id === userProfile._id
            ? data.to_user_id
            : data.from_user_id;

        const chatId = getChatId(userProfile, otherUser);
        setChats((prev) => {
          const filtered = prev.filter(
            (chat) => getChatId(chat.from_user_id, chat.to_user_id) !== chatId
          );
          return [
            {
              _id: chatId,
              from_user_id: userProfile,
              to_user_id: otherUser,
              lastMessage: data.text,
            },
            ...filtered,
          ];
        });

        // Browser notification if I'm the receiver
        if (
          Notification.permission === "granted" &&
          data.to_user_id._id === userProfile._id
        ) {
          new Notification(`${data.from_user_id.name}`, { body: data.text });
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [backendUrl, token, userProfile, selectedChat]);

  // Utility to get the "other user" in a chat
  const getOtherUser = (chat) => {
    if (!chat || !chat.from_user_id || !chat.to_user_id) {
      return { _id: "", name: "Unknown" };
    }
    if (!userProfile || !userProfile._id) {
      return { _id: "", name: "Unknown" };
    }
    return chat.from_user_id._id === userProfile._id
      ? chat.to_user_id
      : chat.from_user_id;
  };

  const getChatId = (userA, userB) => {
    const ids = [userA._id, userB._id].sort();
    return ids.join("_");
  };

  // Fetch recent chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/messages/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data.success) setChats(data.messages);

        if (openChatUserId) {
          let existingChat = data.messages.find(
            (chat) =>
              chat.from_user_id._id === openChatUserId ||
              chat.to_user_id._id === openChatUserId
          );

          if (!existingChat) {
            existingChat = {
              _id: `new-${openChatUserId}`,
              from_user_id: userProfile,
              to_user_id: { _id: openChatUserId, name: authorName },
              text: "",
            };
          }

          setSelectedChat(existingChat);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, [token, backendUrl, openChatUserId, userProfile]);

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      const otherUserId = getOtherUser(selectedChat)._id;

      try {
        const res = await axios.post(
          `${backendUrl}/api/messages/chat`,
          { to_user_id: otherUserId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;

        if (data.success) setMessages(data.messages.reverse());
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedChat, token, backendUrl]);

  // Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const otherUser = getOtherUser(selectedChat);

    try {
      const res = await axios.post(
        `${backendUrl}/api/messages/send`,
        {
          to_user_id: otherUser._id,
          text: newMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.data;
      if (data.success) {
        const chatId = getChatId(userProfile, otherUser);

        // ✅ Only update chat list (recent chats)
        setChats((prev) => {
          const filtered = prev.filter(
            (chat) => getChatId(chat.from_user_id, chat.to_user_id) !== chatId
          );
          return [
            {
              _id: chatId,
              from_user_id: userProfile,
              to_user_id: otherUser,
              lastMessage: data.message.text,
            },
            ...filtered,
          ];
        });

        // ❌ Remove this line (SSE already updates messages)
        // setMessages((prev) => [...prev, data.message]);

        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 ">
      {/* 64px = Navbar height */}

      {/* Left panel: chat list */}
      <div className="w-1/3 bg-white shadow-md border-r border-gray-200 flex flex-col">
        {/* Sticky header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold   sticky top-[75px] z-10">
          Messages
        </div>

        {/* Scrollable chat list */}
        <div className="flex-1  overflow-y-auto mt-20">
          {chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const chatId = getChatId(userProfile, otherUser);

            return (
              <div
                key={chatId}
                className={`p-4 cursor-pointer transition ${
                  selectedChat &&
                  getChatId(userProfile, getOtherUser(selectedChat)) === chatId
                    ? "bg-violet-50"
                    : "hover:bg-gray-100"
                }`}
                onClick={() =>
                  setSelectedChat({
                    _id: chatId,
                    from_user_id: userProfile,
                    to_user_id: otherUser,
                    lastMessage: chat.lastMessage,
                  })
                }
              >
                <div className="flex items-center gap-3">
                  {otherUser?.profileImage ? (
                    <img
                      src={otherUser.profileImage}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={assets.profile_icon}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-800">
                      {otherUser?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {chat.lastMessage || "No messages yet"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel: chat box */}
      <div className="flex-1 flex flex-col bg-white shadow-md">
        {selectedChat ? (
          <>
            {/* Sticky chat header */}
            <div className="p-4 flex gap-3 border-b border-gray-200 bg-gray-50 font-semibold sticky top-[75px] z-10">
              <img
                src={
                  getOtherUser(selectedChat).profileImage || assets.profile_icon
                }
                className="w-8 h-8 rounded-full object-cover inline-block ml-4"
                alt=""
              />
              {getOtherUser(selectedChat).name}
            </div>

            {/* Scrollable messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-2 flex ${
                    msg.from_user_id._id === userProfile._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg shadow-md max-w-xs break-words ${
                      msg.from_user_id._id === userProfile._id
                        ? "bg-violet-500 text-white"
                        : "bg-white text-gray-800"
                    }`}
                    ref={scrollRef}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar stays at bottom */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
