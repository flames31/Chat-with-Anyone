import { BrowserRouter, Route, Switch } from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ChatroomPage from "./Pages/ChatroomPage";
import IndexPage from "./Pages/IndexPage";
import { React, useState, useEffect } from "react";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });
      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("Error", "Socket disconnected!");
      });
      newSocket.on("connect", () => {
        makeToast("Success", "Socket connected!");
      });
      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={IndexPage}></Route>
        <Route
          exact
          path="/login"
          render={() => <LoginPage setupSocket={setupSocket} />}
        ></Route>
        <Route exact path="/register" component={RegisterPage}></Route>
        <Route
          exact
          path="/dashboard"
          render={() => <DashboardPage socket={socket} />}
        ></Route>
        <Route
          exact
          path="/chatroom/:id"
          render={() => <ChatroomPage socket={socket} />}
        ></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
