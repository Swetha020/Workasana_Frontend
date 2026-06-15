const ProjectModal = ({ project, setProject, handleProjectSubmit }) => {
  return (
    <div
      className="modal fade"
      id="projectModal"
      tabIndex="-1"
      aria-labelledby="projectModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-center" id="projectModalLabel">
              Add New Project
            </h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleProjectSubmit}>
              <label htmlFor="" className="form-label">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter Project Name"
                value={project.name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
                }
                className="form-control"
                required
              />{" "}
              <br />
              <label htmlFor="" className="form-label">
                Project Description
              </label>
              <textarea
                placeholder="Enter Project Description"
                value={project.description}
                onChange={(e) =>
                  setProject({
                    ...project,
                    description: e.target.value,
                  })
                }
                className="form-control"
                required
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectModal