import useFetch from "../hooks/useFetch";
import Select from "react-select";
const TeamModal = ({ team, setTeam, handleTeamSubmit, isEdit = false }) => {
  const { data: members } = useFetch("https://workasana-backend-omega.vercel.app/users");
  return (
    <div
      className="modal fade"
      id="teamModal"
      tabIndex="-1"
      aria-labelledby="teamModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className="modal-title justify-content-center"
              id="teamModalLabel"
            >
              {isEdit ? "Edit Team" : "Add New Team"}
            </h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleTeamSubmit}>
              <label htmlFor="" className="form-label">
                Team Name
              </label>
              <input
                type="text"
                placeholder="Enter Team Name"
                value={team.name}
                onChange={(e) => setTeam({ ...team, name: e.target.value })}
                className="form-control"
                disabled={isEdit}
                required
              />
              <br />
              <label htmlFor="" className="form-label">
                Team Description
              </label>
              <textarea
                placeholder="Enter Team Description"
                value={team.description}
                onChange={(e) =>
                  setTeam({
                    ...team,
                    description: e.target.value,
                  })
                }
                className="form-control"
                disabled={isEdit}
                required
              /> <br />
              <label htmlFor="" className="form-label">Members</label>
              <Select
                isMulti
                options={members?.map((member) => ({
                  value: member._id,
                  label: member.name,
                }))}
                onChange={(selected) =>
                  setTeam({
                    ...team,
                    members: selected ? selected.map((item) => item.value) : [],
                  })
                }
                value={members
                  ?.filter((user) => team.members.includes(user._id))
                  .map((user) => ({
                    value: user._id,
                    label: user.name,
                  }))}
              />
              <div className="modal-footer">
                <button
                  type="button" 
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeamModal;
