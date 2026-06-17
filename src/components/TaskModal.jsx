import useFetch from "../hooks/useFetch";
import Select from "react-select";

const TaskModal = ({
  task,
  setTask,
  handleTaskSubmit,
  show,
  onClose,
  isEdit = false,
}) => {
  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useFetch("https://workasana-backend-omega.vercel.app/projects");

  const {
    data: teams,
    loading: teamsLoading,
    error: teamsError,
    refetch: refetchteams,
  } = useFetch("https://workasana-backend-omega.vercel.app/teams");

  const {
    data: owners,
    loading: ownersLoading,
    error: ownersError,
    refetch: refetchowners,
  } = useFetch("https://workasana-backend-omega.vercel.app/users");

  const {
    data: tags,
    loading: tagsLoading,
    error: tagsError,
    refetch: refetchtags,
  } = useFetch("https://workasana-backend-omega.vercel.app/tags");

  const priorities = ["High", "Medium", "Low"];

  const selectedTeam = teams?.find((team) => team._id === task.team);
  if (!show) return null;
  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div
        className="modal show d-block"
        id="taskModal"
        tabIndex="-1"
        role="dialog"
        // aria-labelledby="taskModalLabel"
        // aria-hidden="true"
        // data-bs-backdrop="static"
        // data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center" id="taskModalLabel">
                Add New Task
              </h5>
            </div>
            <div className="modal-body">
              <form onSubmit={handleTaskSubmit}>
                <label htmlFor="" className="form-label">
                  Task Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Task Name"
                  value={task.name}
                  onChange={(e) => setTask({ ...task, name: e.target.value })}
                  className="form-control"
                  disabled={isEdit}
                  required
                />{" "}
                <br />
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <label htmlFor="" className="form-label">
                    Project
                  </label>
                  <select
                    className="form-select"
                    value={task.project}
                    onChange={(e) =>
                      setTask({ ...task, project: e.target.value })
                    }
                    disabled={isEdit}
                  >
                    <option value="">--Select--</option>
                    {projects?.map((project) => (
                      <option value={project._id}>{project.name}</option>
                    ))}
                  </select>
                  <label htmlFor="">Team</label>
                  <select
                    className="form-select"
                    value={task.team}
                    onChange={(e) =>
                      setTask({ ...task, team: e.target.value, owners: [] })
                    }
                  >
                    <option value="">--Select--</option>
                    {teams?.map((team) => (
                      <option value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <br />
                <label className="form-label">Owners</label>
                <Select
                  isMulti
                  options={
                    selectedTeam?.members?.map((user) => ({
                      value: user._id,
                      label: user.name,
                    })) || []
                  }
                  onChange={(selected) =>
                    setTask({
                      ...task,
                      owners: selected
                        ? selected.map((item) => item.value)
                        : [],
                    })
                  }
                  value={selectedTeam?.members
                    ?.filter((user) => task.owners?.includes(user._id))
                    .map((user) => ({
                      value: user._id,
                      label: user.name,
                    }))}
                />
                <br />
                <label className="form-label">Tags</label>
                <Select
                  isMulti
                  options={tags?.map((tag) => ({
                    value: tag._id,
                    label: tag.name,
                  }))}
                  onChange={(selected) =>
                    setTask({
                      ...task,
                      tags: selected ? selected.map((item) => item.value) : [],
                    })
                  }
                  value={tags
                    ?.filter((tag) => task.tags?.includes(tag._id))
                    .map((tag) => ({
                      value: tag._id,
                      label: tag.name,
                    }))}
                />
                <br />
                <div className="d-flex justify-content-center align-items-center gap-3 ">
                  <label className="form-label text-nowrap">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={task.dueDate}
                    onChange={(e) =>
                      setTask({ ...task, dueDate: e.target.value })
                    }
                  />
                  <label htmlFor="">Priority</label>
                  <select
                    className="form-select"
                    value={task.priority}
                    onChange={(e) =>
                      setTask({ ...task, priority: e.target.value })
                    }
                  >
                    <option value="">--Select--</option>
                    {priorities?.map((priority) => (
                      <option value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <br />{" "}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                    // data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TaskModal;
