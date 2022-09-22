import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import Homepage from "./components/homepage/homepage";
import ErrorPage from "./components/homepage/errorpage";
import MainNavbar from "./components/navbar/navbar";
import Users from "./components/users/list";
import Edit from "./components/users/edit";
import Create from "./components/users/create";
import Login from "./components/homepage/login";
import EditProfile from "./components/profile/editProfile";

// import context
import { AuthProvider } from "./context/authContext";

// routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  { path: "/login", element: <Login /> },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/edit/:id",
    element: <Edit />,
  },
  {
    path: "/users/create",
    element: <Create />,
  },
  {
    path: "/editProfile",
    element: <EditProfile />,
    loader: async () => {
      return await fetch("/api/auth/me").then((resp) => resp.json());
    },
  },
]);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  componentDidMount() {}
  render() {
    return (
      <AuthProvider>
        <MainNavbar />
        <div className="page-header"></div>
        <RouterProvider router={router} />
      </AuthProvider>
    );
  }
}

export default App;
