import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
export default function Settings() {
  const { user } = useUserContext();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://workasana-backend-omega.vercel.app/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div><Loader/></div>;
  }

  return (
    <div className="container">
      <div className="mb-4 mx-2">
        <h1 className="mt-4 mb-0">User Profile</h1>
        <p className="text-secondary">
          Manage your user profile 
        </p>
      </div>
      <hr />
      <div className="card p-3 mb-4">
        <h4>User Details</h4>

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <div className="card p-3">
        <h4>Change Password</h4>

        <form onSubmit={handlePasswordChange}>
          <div className="mb-3">
            <label>Current Password</label>

            <input
              type="password"
              className="form-control"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label>New Password</label>

            <input
              type="password"
              className="form-control"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>

            <input
              type="password"
              className="form-control"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
