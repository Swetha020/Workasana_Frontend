import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import "./ProjectDetail.css";
import TaskModal from "../components/TaskModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function ProjectDetail() {
  const projectId = useParams().projectId;
  const [sortType, setSortType] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const filterStatus = searchParams.get("status") || "";
  const [showModal, setShowModal] = useState(false);

  const {
    data: project,
    loading,
    error,
  } = useFetch(
    `https://workasana-backend-omega.vercel.app/projects/${projectId}`,
  );

  const [task, setTask] = useState({
    name: "",
    project: project?._id,
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    priority: "",
  });

  const { data: tasks, refetch: refetchTasks } = useFetch(
    `https://workasana-backend-omega.vercel.app/tasks`,
  );

  const projectTasks = tasks?.filter(
    (task) => task.project?.name === project?.name,
  );
  const priorityOrder = { Low: 1, Medium: 2, High: 3 };

  const filteredTasks = filterStatus
    ? projectTasks?.filter((task) => task.status === filterStatus)
    : projectTasks;

  const sortedTasks = [...(filteredTasks || [])].sort((a, b) => {
    switch (sortType) {
      case "priorityLowToHigh":
        return priorityOrder[a.priority] - priorityOrder[b.priority];

      case "priorityHighToLow":
        return priorityOrder[b.priority] - priorityOrder[a.priority];

      case "newest":
        return new Date(b.dueDate) - new Date(a.dueDate);

      case "oldest":
        return new Date(a.dueDate) - new Date(b.dueDate);

      default:
        return 0;
    }
  });

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    fetch("https://workasana-backend-omega.vercel.app/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTask({
          name: "",
          project: project?._id,
          team: "",
          owners: [],
          tags: [],
          dueDate: "",
          priority: "",
        });
        toast.success("New Task Added");
        setShowModal(false)
        refetchTasks();
      })
      .catch((error) => {
        console.error(error);
        toast.success("Failed to add new Task");
      });
  };

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <p>Error loading project</p>;

  return (
    <div className="container py-4 ">
      <Link to="/home" className="text-decoration-none">
        ← Back To Dashboard
      </Link>

      <h1 className="mt-3">{project?.name}</h1>
      <p className="text-secondary">{project?.description}</p>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div className="d-flex gap-2 mt-3 flex-wrap">
          <p>Sort By:</p>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <p
              className="sort-btn"
              onClick={() => setSortType("priorityLowToHigh")}
            >
              Priority Low-High
            </p>
            <p
              className="sort-btn"
              onClick={() => setSortType("priorityHighToLow")}
            >
              Priority High-Low
            </p>
            <p className="sort-btn" onClick={() => setSortType("newest")}>
              Newest First
            </p>
            <p className="sort-btn" onClick={() => setSortType("oldest")}>
              Oldest First
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <p className="mt-3">Filter:</p>
          <select
            value={filterStatus}
            className="form-select"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setSearchParams({ status: value });
              } else {
                setSearchParams({});
              }
            }}
          >
            <option value="">All</option>
            <option value="To Do">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
          <button
            className="btn btn-primary w-100"
            onClick={() => setShowModal(true)}
            // data-bs-toggle="modal"
            // data-bs-target="#taskModal"
          >
            + New Task
          </button>
          <TaskModal
            task={task}
            setTask={setTask}
            handleTaskSubmit={handleTaskSubmit}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
      <div className="table-responsive rounded m-2">
        <table className="table tasks-table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th className="text-secondary">TASKS</th>
              <th className="text-secondary">OWNER</th>
              <th className="text-secondary">PRIORITY</th>
              <th className="text-secondary">DUE ON</th>
              <th className="text-secondary">STATUS</th>
              <th className="text-secondary"></th>
            </tr>
          </thead>

          <tbody>
            {sortedTasks.length > 0 ? (
              sortedTasks?.map((task) => (
                <tr key={task._id}>
                  <td className="fw-semibold">{task.name}</td>
                  <td>
                    <div className="d-flex owners-data">
                      {task.owners.map((owner) => (
                        <span key={owner._id} className="owner-avatar">
                          {owner.name.slice(0, 1).toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge rounded-pill ${
                        task.priority === "High"
                          ? "text-bg-danger"
                          : task.priority === "Medium"
                            ? "text-bg-warning"
                            : "text-bg-secondary"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td>
                    {new Date(task.dueDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        task.status === "Completed"
                          ? "text-bg-success"
                          : task.status === "In Progress"
                            ? "text-bg-warning"
                            : task.status === "Blocked"
                              ? "text-bg-danger"
                              : "text-bg-primary"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td>
                    <Link
                      className="btn btn-sm btn-light"
                      to={`/tasks/${task._id}`}
                    >
                      →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <h5 className="mt-2 mb-0">No tasks found</h5>
                    <p className="text-muted">
                      Try changing filters or create a new task
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
