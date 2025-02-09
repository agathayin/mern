import React, { useState, useEffect } from "react";
import { socket } from "../../socket";
import toast from "react-hot-toast";

export default function Notification(props) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  let event = props.event || "chatMessage";
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onReceiveMessage(value) {
      console.log("message received", value);
      if (value.message) {
        toast(value.message, {
          style: { background: "#fff", borderColor: "#0dcaf0", color: "#0dcaf0" },
          position: "top-right",
        });
      }
      if (props.onReceive !== undefined) {
        props.onReceive(value);
      }
    }
    // Add an event listener to the 'chatMessage' event
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(event, onReceiveMessage);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(event, onReceiveMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return props.show ? (
    <span className={isConnected ? "text-success" : "text-secondary"}>
      <i className="bi bi-record2-fill"></i>
    </span>
  ) : null;
}
