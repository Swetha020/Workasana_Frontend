import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
import TeamModal from "../components/TeamModal";
import { toast } from "react-toastify";

export default function TeamDetail() {
  const { teamId } = useParams();
  const { data: teamData, refetch } = useFetch(
    `https://workasana-backend-omega.vercel.app/teams/${teamId}`,
  );
  const [team, setTeam] = useState({ name: "", description: "", members: [] });

  if (!teamData) {
    return <h2>Loading...</h2>;
  }

  const handleTeamSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`https://workasana-backend-omega.vercel.app/teams/${team._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });
    if (response.ok) {
      toast.success("New Member Added")
      refetch();
    }
  };

  return (
    <div className="m-3">
      <Link to="/teams" className="text-decoration-none">
        ← Back To View Teams
      </Link>
      <div className="m-4">
        <h1 className="mt-3">{teamData.name}</h1>
        <p className="text-secondary">{teamData.description}</p>
        <hr />
        <h3>Members</h3>
        <ul className="list-unstyled mt-4">
          {teamData.members.map((member) => (
            <li key={member._id} className="d-flex align-items-center my-4">
              <span className="members-pill me-3">
                {member.name.slice(0, 1).toUpperCase()}
              </span>
              {member.name}
            </li>
          ))}
        </ul>
        <button
          data-bs-toggle="modal"
          data-bs-target="#teamModal"
          onClick={() => {
            setTeam({
              _id: teamData._id,
              name: teamData.name,
              description: teamData.description,
              members: teamData.members.map((member) => member._id),
            });
          }}
          className="btn btn-primary mt-2"
        >
          + Manage Members
        </button>
        <TeamModal
          team={team}
          setTeam={setTeam}
          handleTeamSubmit={handleTeamSubmit}
          isEdit={Boolean(team._id)}
        />
      </div>
    </div>
  );
}
