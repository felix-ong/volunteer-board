import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import ROLES from "../../utils/roles";

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/");
    setUser(null);
  };

  useEffect(() => {
    // const token = user?.token;
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          NUS CCSGP Volunteer Board
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-link" href="/">
              Home
            </a>
            {user?.result?.role === ROLES.Admin && (
              <a className="nav-link" href="/submissions">
                Submissions
              </a>
            )}
            {user?.result?.role === ROLES.Student && (
              <a
                className="nav-link"
                href={`/registrations/${user.result._id}`}
              >
                Registered Jobs
              </a>
            )}
            {[ROLES.Admin, ROLES.StudentGroup, ROLES.Organization].includes(
              user?.result?.role
            ) && (
              <a className="nav-link" href="/jobs/new">
                New Job
              </a>
            )}
            {user ? (
              <a className="nav-link" href="/" onClick={logout}>
                Logout
              </a>
            ) : (
              <a className="nav-link" href="/auth">
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
