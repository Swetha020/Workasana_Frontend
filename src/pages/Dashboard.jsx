import { useState } from "react";
import useFetch from "../hooks/useFetch";
import ProjectModal from "../components/ProjectModal";
import TaskModal from "../components/TaskModal";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { CgCalendar } from "react-icons/cg";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tasksFilter = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const [project, setProject] = useState({ name: "", description: "" });
  const [task, setTask] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    priority: "",
  });

  const { user } = useUserContext();
  const navigate = useNavigate();

  const statusColor = {
    "To Do": "primary",
    "In Progress": "warning",
    Done: "success",
    Blocked: "danger",
  };

  const priorityColor = {
    High: "priority-high",
    Medium: "priority-medium",
    Low: "priority-low",
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    fetch("https://workasana-backend-omega.vercel.app/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProject({ name: "", description: "" });
        toast.success("New Project Added");
        refetchProjects();
      })
      .catch((e) => toast.error("Failed to add Project "));
  };

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
          project: "",
          team: "",
          owners: [],
          tags: [],
          dueDate: "",
          priority: "",
        });
        toast.success("New Task Added");
        refetchTasks();
      })
      .catch((e) => toast.error("Failed to add Task "));
  };

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useFetch("https://workasana-backend-omega.vercel.app/projects");

  const {
    data: tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useFetch("https://workasana-backend-omega.vercel.app/tasks");

  const searchText = search?.toLowerCase() || "";

  const filteredTasks = tasks?.filter((task) => {
    const filteredByStatus = tasksFilter ? task.status === tasksFilter : true;

    const filteredBySearch = searchText
      ? task.name?.toLowerCase().includes(searchText) ||
        task.project?.name?.toLowerCase().includes(searchText) ||
        task.status?.toLowerCase().includes(searchText) ||
        task.priority?.toLowerCase().includes(searchText) ||
        task.owners?.some((owner) =>
          owner.name?.toLowerCase().includes(searchText),
        )
      : true;

    return filteredByStatus && filteredBySearch;
  });

  const userTasks = filteredTasks?.filter((task) =>
    task.owners.some((owner) => owner.name === user.name),
  );

  const otherTasks = filteredTasks?.filter(
    (task) => !task.owners.some((owner) => owner.name === user.name),
  );

  const filteredProjects = projects?.filter((project) => {
    if (!searchText) return true;
    return (
      project.name?.toLowerCase().includes(searchText) ||
      project.description?.toLowerCase().includes(searchText)
    );
  });

  return (
    <>
      <div className="container-fluid px-4 py-3">
        <form
          className="d-flex w-100 mb-4"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams(searchParams);
            const searchValue = e.target.search.value.trim();
            if (searchValue) {
              params.set("search", searchValue);
            } else {
              params.delete("search");
            }
            setSearchParams(params);
          }}
        >
          <input
            className="form-control me-2 flex-grow-1"
            name="search"
            type="search"
            placeholder="Search"
            aria-label="Search"
            defaultValue={search || ""}
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="me-4 ">Projects</h1>
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#projectModal"
            >
              + New Project
            </button>
            <ProjectModal
              project={project}
              setProject={setProject}
              handleProjectSubmit={handleProjectSubmit}
            />
          </div>
        </div>
        <div>
          {projectsLoading && <p>Loading projects...!</p>}
          {filteredProjects && (
            <div className="row">
              {filteredProjects?.map((project) => (
                <div className="col-12 col-md-4" key={project._id}>
                  <div
                    className="card project-card"
                    onClick={() => navigate(`/projects/${project._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <h3>{project.name}</h3>
                      <p className="truncate-text">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <br />
        <hr />
        <br />
        <div className="d-flex align-items-center mb-3">
          <h1 className="text-nowrap me-4">Tasks</h1>

          <select
            className="form-select w-auto me-auto"
            value={tasksFilter}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);

              if (e.target.value) {
                params.set("status", e.target.value);
              } else {
                params.delete("status");
              }

              setSearchParams(params);
            }}
          >
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Blocked">Blocked</option>
          </select>

          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#taskModal"
          >
            + New Task
          </button>
          <TaskModal
            task={task}
            setTask={setTask}
            handleTaskSubmit={handleTaskSubmit}
          />
        </div>
        <div>
          <h2 className="mt-4">My Tasks</h2>
          {tasksLoading && <p>Loading Tasks...!</p>}
          {userTasks && (
            <div className="row">
              {userTasks?.map((task) => (
                <div className="col-12 col-md-4" key={task._id}>
                  <div
                    className={`card task-card ${priorityColor[task?.priority] || ""}`}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">{task?.name}</h3>
                        <span
                          className={`badge bg-${statusColor[task?.status] || "secondary"}`}
                        >
                          {task?.status}
                        </span>
                      </div>

                      <p className="text-secondary d-flex align-items-center gap-2 mt-2">
                        <CgCalendar />
                        Due:{" "}
                        {new Date(task.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="d-flex ms-1">
                        {task?.owners.map((owner) => (
                          <span className="members-pill">
                            {owner.name.slice(0, 1)}
                          </span>
                        ))}
                      </p>
                      <p>
                        {task.tags?.map((tag) => (
                          <span className="badge bg-secondary mt-2 me-2">
                            {tag.name}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <h2 className="my-4">Other Tasks</h2>
          {otherTasks && (
            <div className="row">
              {otherTasks?.map((task) => (
                <div className="col-12 col-md-4" key={task._id}>
                  <div
                    className={`card task-card ${priorityColor[task?.priority] || ""}`}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">{task?.name}</h3>
                        <span
                          className={`badge bg-${statusColor[task?.status] || "secondary"}`}
                        >
                          {task?.status}
                        </span>
                      </div>

                      <p className="text-secondary">
                        Due Date:{" "}
                        {new Date(task.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="ms-1">
                        {task?.owners.map((owner) => (
                          <span className="members-pill">
                            {owner.name.slice(0, 1)}{" "}
                          </span>
                        ))}
                      </p>
                      <p>
                        {task.tags?.map((tag) => (
                          <span className="badge bg-secondary mt-2 me-2">
                            {tag.name}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
