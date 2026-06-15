import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export default function SignUp() {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const signUpHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://workasana-backend-omega.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
                toast.success("Registration success.! Welcome to workasana");

        navigate("/dashboard/home");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="form-holder">
          <h1> Create Account</h1>
          <form onSubmit={signUpHandler}>
            <div className="mb-3">
              <label htmlFor="" className="form-label mb-0">
                Name:
              </label>
              <input
                type="text"
                className="form-control"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label mb-0">
                Mail Id:
              </label>
              <input
                type="email"
                className="form-control"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label mb-0">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="form-btn w-100">
              Sign Up
            </button>
          </form>
          <p className="text-center mt-4">
            Have an existing account?{" "}
            <Link to={"/login"} className="link-pill">
              Login
            </Link>
          </p>
        </div>

        <div className="img-container">
          <img src="signup.jpg" alt="work-img" className="signup-img" />
        </div>
      </div>
    </>
  );
}
