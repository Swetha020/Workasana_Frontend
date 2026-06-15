import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";

export default function Login() {
  const [loginDetail, setLoginDetail] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const userToken = localStorage.getItem("token");

  if (userToken) {
    return <Navigate to="/home" />;
  }

  const { setUser } = useUserContext();

  const loginAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://workasana-backend-omega.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetail),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user)
        navigate("/dashboard/home");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="form-holder">
        <h1>Login to Workasana</h1>
        <p>Please Enter your Details</p>
        <form onSubmit={loginAccount}>
          <div className="form-floating mb-3">
            <input
              type="text"
              placeholder="Email Address"
              className="form-control"
              value={loginDetail.email}
              onChange={(e) => {
                setLoginDetail({ ...loginDetail, email: e.target.value });
              }}
            />
            <label>Email Address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={loginDetail.password}
              onChange={(e) => {
                setLoginDetail({ ...loginDetail, password: e.target.value });
              }}
            />
            <label>Password</label>
          </div>

          <button className="form-btn w-100" type="submit">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to={"/signup"} className="link-pill">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="img-container">
        <img src="login.jpg" alt="work-img" className="login-img" />
      </div>
    </div>
  );
}
