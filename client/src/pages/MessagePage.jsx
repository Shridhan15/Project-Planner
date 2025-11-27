import { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import { assets } from "../assets/assets";
import MessageNotification from "../components/MessageNotification";

function MessagePage() {
  const { userProfile, token, backendUrl, pushMessageNotification } =
    useContext(ProjectContext);
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
        if (data.to_user_id._id === userProfile._id) {
          pushMessageNotification(data.from_user_id, data.text);

          if (Notification.permission === "granted") {
            new Notification(`${data.from_user_id.name}`, { body: data.text });
          }
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

  //get the other user in a chat
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

  useEffect(() => {
    console.log("All messages (updated):", chats);
  }, [chats]);

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

        // Only update chat list (recent chats)
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

        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white">
      {/* LEFT SIDEBAR */}
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r border-white/10 backdrop-blur-xl bg-white/5 shadow-xl">
        {/* Sidebar Header */}
        <div
          className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-lg 
    font-bold text-lg sticky top-16 z-10 shadow-md"
        >
          Messages
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto px-2  pt-20">
          {chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const chatId = getChatId(userProfile, otherUser);

            return (
              <div
                key={chatId}
                className={`
    p-3 cursor-pointer rounded-lg 
    transition-all duration-200 ease-out mb-2
    border border-transparent
    ${
      selectedChat &&
      getChatId(userProfile, getOtherUser(selectedChat)) === chatId
        ? "bg-violet-600/20 border-violet-400/40 shadow-md scale-[1.02]"
        : "hover:bg-white/10"
    }
  `}
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
                  <img
                    src={otherUser?.profileImage || assets.profile_icon}
                    className="w-11 h-11 rounded-full border border-white/20 object-cover"
                    alt="profile"
                  />
                  <div>
                    <div className="font-semibold text-white">
                      {otherUser?.name}
                    </div>
                    <div className="text-sm text-gray-300 truncate">
                      {chat.lastMessage || "No messages yet"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE - CHAT BOX */}
      <div className="flex-1 flex flex-col pt-16">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div
              className="p-4 flex gap-3 border-b border-white/10 bg-white/5 
          backdrop-blur-xl font-semibold sticky top-[64px] z-10 shadow-lg"
            >
              <img
                src={
                  getOtherUser(selectedChat).profileImage || assets.profile_icon
                }
                className="w-9 h-9 rounded-full border border-white/20 object-cover ml-2"
                alt=""
              />
              <span className="text-white">
                {getOtherUser(selectedChat).name}
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-black/20">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-3 flex ${
                    msg.from_user_id._id === userProfile._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    ref={scrollRef}
                    className={`
                  px-4 py-2 rounded-xl max-w-xs break-words shadow-md 
                  ${
                    msg.from_user_id._id === userProfile._id
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/30"
                      : "bg-white/10 text-gray-200 border border-white/10"
                  }
                `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-black/20 border border-white/20 text-white 
              rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 
              outline-none placeholder-gray-400"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />

              <button
                onClick={handleSendMessage}
                className="px-5 py-2 rounded-lg bg-gradient-to-r 
              from-violet-600 to-indigo-600 text-white shadow-lg
              hover:scale-105 active:scale-95 transition-all"
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
