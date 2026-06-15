import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../contexts/UserContext";

export default function TaskDetail() {
  const taskId = useParams().taskId;

  const statuses = ["To Do", "In Progress", "Blocked"];

  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: taskData, refetch } = useFetch(
    `https://workasana-backend-omega.vercel.app/tasks/${taskId}`,
  );

  const { user } = useUserContext();

  const updateStatus = async (status) => {
    try {
      await fetch(
        `https://workasana-backend-omega.vercel.app/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );
      toast.success("Task Status Updated");
      refetch();
    } catch (error) {
      toast.error("Failed to Update Status");
      console.error(error);
    }
  };

  const isOwner = () => {
    return taskData?.owners?.some((owner) => owner?.name === user?.name);
  };

  return (
    <>
      <div className="m-3">
        <Link to="/home" className="text-decoration-none">
          ← Back To Dashboard
        </Link>
        <div className="my-4 p-4 border rounded">
          {taskData && (
            <div>
              <h1>{taskData.name}</h1>
              <hr />
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <p>Project: {taskData.project?.name}</p>
                  <p>Team: {taskData.team?.name}</p>
                  <p>
                    Owners:{" "}
                    {taskData.owners.map((owner) => owner.name).join(", ")}{" "}
                  </p>
                </div>
                <div className="col-12 col-md-6">
                  <p>
                    Due Date:{" "}
                    {new Date(taskData.dueDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>Current Status: {taskData.status}</p>
                  <p>Tags: {taskData.tags.map((tag) => tag.name).join(", ")}</p>
                </div>
              </div>
              <hr />
              <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center justify-content-between">
                <div className="d-flex flex-column flex-sm-row gap-2 align-items-start align-items-sm-center">
                  <select
                    className="form-select w-100 d-inline me-3"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={!isOwner()}
                    style={{cursor:"pointer"}}
                  >
                    <option value="" disabled>
                      Change Status
                    </option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => updateStatus(selectedStatus)}
                    disabled={
                      !selectedStatus ||
                      selectedStatus === taskData.status ||
                      !isOwner()
                    }
                  >
                    Update Status
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-success px-3 me-5"
                    onClick={() => updateStatus("Completed")}
                    disabled={taskData.status === "Completed" || !isOwner()}
                  >
                    Mark As Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
