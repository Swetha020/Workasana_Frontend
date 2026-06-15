import { useState } from "react";
import TeamModal from "../components/TeamModal";
import useFetch from "../hooks/useFetch";
import "./Teams.css";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const {
    data: teams,
    loading,
    error,
  } = useFetch("https://workasana-backend-omega.vercel.app/teams");

  const [team, setTeam] = useState({
    name: "",
    members: [],
    description: "",
  });

  const navigate = useNavigate();

  const handleTeamSubmit = (e) => {
    e.preventDefault();
    fetch("https://workasana-backend-omega.vercel.app/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message));
  };

  return (
    <>
      <div className="m-3">
        <div className="mb-4 mx-2">
          <h1 className="mt-4 mb-0">Teams</h1>
          <p className="text-secondary">
           View and Manage teams and team members
          </p>
        </div>{" "}
        <hr />
        <div className="row my-4">
          {teams?.map((team) => (
            <div className="col-12 col-md-4">
              <div
                className="card"
                onClick={() => navigate(`/teams/${team._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <h3>{team.name}</h3>
                  <p>{team.description}</p>
                  <p className="d-flex ms-2">
                    {team.members.map((member) => (
                      <span className="members-pill">
                        {member.name.slice(0, 1).toUpperCase()}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="col-12 col-md-4">
            <div
              className="card h-100 cursor-pointer"
              role="button"
              data-bs-toggle="modal"
              data-bs-target="#teamModal"
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                <h4>+ Add New Team</h4>
              </div>
            </div>

            <TeamModal
              team={team}
              setTeam={setTeam}
              handleTeamSubmit={handleTeamSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
