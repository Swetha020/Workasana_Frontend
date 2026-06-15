import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { useUserContext } from "../contexts/UserContext";
import useFetch from "../hooks/useFetch";
import {
  BiBarChart,
  BiBarChartAlt,
  BiBarChartSquare,
  BiBriefcase,
  BiDoughnutChart,
  BiHourglass,
  BiSolidHourglassBottom,
  BiSolidHourglassTop,
  BiTask,
  BiTaskX,
} from "react-icons/bi";
import { RiTeamLine } from "react-icons/ri";
import { BsHourglassSplit } from "react-icons/bs";
import { MdOutlineTaskAlt } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function Report() {
  const statuslabels = ["To Do", "In Progress", "Completed", "Blocked"];

  const { user } = useUserContext();

  const { data: tasks } = useFetch("https://workasana-backend-omega.vercel.app/tasks");
  const { data: teams } = useFetch("https://workasana-backend-omega.vercel.app/teams");
  const { data: projects } = useFetch("https://workasana-backend-omega.vercel.app/projects");

  const userTasks =
    tasks?.filter((task) =>
      task.owners.some((owner) => owner.name === user.name),
    ) || [];

  const completedTasks = userTasks.filter(
    (task) => task.status === "Completed",
  );
  const incompleteTasks = userTasks.filter(
    (task) => task.status != "Completed",
  );

  const todoCount = userTasks.filter((task) => task.status === "To Do").length;

  const progressCount = userTasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const completedCount = userTasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const blockedCount = userTasks.filter(
    (task) => task.status === "Blocked",
  ).length;

  const projectLabels = projects?.map((project) => project.name) || [];

  const totalTasksPerProject =
    projects?.map(
      (project) =>
        tasks?.filter((task) => task.project.name === project.name).length,
    ) || [];

  const completedTasksPerProject =
    projects?.map(
      (project) =>
        tasks?.filter(
          (task) =>
            task.project.name === project.name && task.status === "Completed",
        ).length,
    ) || [];

  const teamLabels = teams?.map((team) => team.name) || [];
  const tasksCompletedByTeams = teams?.map(
    (team) =>
      tasks?.filter(
        (task) => task.team.name === team.name && task.status === "Completed",
      ).length || 0,
  );
  const totalTasksCompleted = tasks?.filter(
    (task) => task.status === "Completed",
  );

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Your Task Status",
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          boxWidth: 6,
          padding: 8,
        },
      },
      title: {
        display: true,
        text: "Tasks By Status",
      },
    },
  };

  const tasksBarData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        label: "Tasks",
        data: [completedTasks.length, incompleteTasks.length],
        backgroundColor: ["#4bc0c080", "#ff638480"],
      },
    ],
  };

  const projectsBarOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Project Progress",
      },
      legend: {
        position: "top",
      },
    },
  };

  const projectsBarData = {
    labels: projectLabels,
    datasets: [
      {
        label: "Total Tasks",
        data: totalTasksPerProject,
        backgroundColor: "#4bc0c080",
      },
      {
        label: "Completed Tasks",
        data: completedTasksPerProject,
        backgroundColor: "#c0554b80",
      },
    ],
  };

  const doughnutData = {
    labels: statuslabels,
    datasets: [
      {
        data: [todoCount, progressCount, completedCount, blockedCount],
        backgroundColor: ["#78aeda", "#e9e289e5", "#81ed83e6", "#ec5c55e6"],
      },
    ],
  };

  const teamBarOptions = {
    indexAxis: "y",
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: true,
        text: "Tasks Completed By Teams",
      },
    },

    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
        },
      },

      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  const teamBarData = {
    labels: teamLabels,
    datasets: [
      {
        label: "Completed Tasks",
        data: tasksCompletedByTeams,
        backgroundColor: "#78aeda",
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  return (
    <div>
      <div className="mb-4 mx-2">
        <h1 className="mt-4 mb-0">Reports</h1>
        <p className="text-secondary">
          Track performance and progress of you and your team
        </p>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-2 col-12 col-lg">
          <div className="card status-card">
            <div className="card-body ">
              <div className="d-flex gap-2">
                <p className="icon-circle">
                  <BiBriefcase />
                </p>
                <p className="m-2 ">Current Projects</p>
              </div>
              <h1>{projects?.length}</h1>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="none"
                  stroke="#f65cda"
                  strokeWidth="12"
                  d="M0,256L24,234.7C48,213,96,171,144,176C192,181,240,235,288,240C336,245,384,203,432,176C480,149,528,139,576,144C624,149,672,171,720,160C768,149,816,107,864,80C912,53,960,43,1008,37.3C1056,32,1104,32,1152,80C1200,128,1248,224,1296,218.7C1344,213,1392,107,1416,53.3L1440,0"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 col-lg">
          <div className="card status-card">
            <div className="card-body ">
              <div className="d-flex gap-2">
                <p className="icon-circle">
                  <RiTeamLine />
                </p>
                <p className="m-2">Total Teams</p>
              </div>
              <h1>{teams?.length}</h1>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  d="M0,256L24,234.7C48,213,96,171,144,176C192,181,240,235,288,240C336,245,384,203,432,176C480,149,528,139,576,144C624,149,672,171,720,160C768,149,816,107,864,80C912,53,960,43,1008,37.3C1056,32,1104,32,1152,80C1200,128,1248,224,1296,218.7C1344,213,1392,107,1416,53.3L1440,0"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 col-lg">
          <div className="card status-card">
            <div className="card-body ">
              <div className="d-flex gap-2">
                <p className="icon-circle">
                  <BiTask />
                </p>
                <p className="m-2 ">Total Tasks</p>
              </div>

              <h1>{tasks?.length}</h1>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="none"
                  stroke="#5cf680"
                  strokeWidth="12"
                  d="M0,256L24,234.7C48,213,96,171,144,176C192,181,240,235,288,240C336,245,384,203,432,176C480,149,528,139,576,144C624,149,672,171,720,160C768,149,816,107,864,80C912,53,960,43,1008,37.3C1056,32,1104,32,1152,80C1200,128,1248,224,1296,218.7C1344,213,1392,107,1416,53.3L1440,0"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 col-lg">
          <div className="card status-card">
            <div className="card-body ">
              <div className="d-flex gap-2">
                <p className="icon-circle">
                  <BsHourglassSplit />
                </p>
                <p className="m-2 ">Tasks in Pipeline</p>
              </div>

              <h1>
                {tasks?.filter((task) => task.status != "Completed").length}
              </h1>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="none"
                  stroke="#f65c5c"
                  strokeWidth="12"
                  d="M0,256L24,234.7C48,213,96,171,144,176C192,181,240,235,288,240C336,245,384,203,432,176C480,149,528,139,576,144C624,149,672,171,720,160C768,149,816,107,864,80C912,53,960,43,1008,37.3C1056,32,1104,32,1152,80C1200,128,1248,224,1296,218.7C1344,213,1392,107,1416,53.3L1440,0"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6 col-lg">
          <div className="card status-card">
            <div className="card-body ">
              <div className="d-flex gap-2">
                <p className="icon-circle">
                  <MdOutlineTaskAlt />
                </p>
                <p className="m-2 ">Tasks Completed</p>
              </div>

              <h1>
                {tasks?.filter((task) => task.status === "Completed").length}
              </h1>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="none"
                  stroke="#5cdff6"
                  strokeWidth="12"
                  d="M0,256L24,234.7C48,213,96,171,144,176C192,181,240,235,288,240C336,245,384,203,432,176C480,149,528,139,576,144C624,149,672,171,720,160C768,149,816,107,864,80C912,53,960,43,1008,37.3C1056,32,1104,32,1152,80C1200,128,1248,224,1296,218.7C1344,213,1392,107,1416,53.3L1440,0"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <hr
        style={{
          backgroundColor: "blue",
          height: "3px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      />
      <div>
        {/* <h3 className="text-center my-4">Your Report</h3> */}
        <div className="charts-container">
          <div className="chart-holder">
            <div className="d-flex align-items-center gap-3 mb-4">
              <p className="icon-circle">
                <BiBarChart />
              </p>
              <div>
                <h5 className="mb-0">Your Task Status</h5>
                <p className="text-secondary">
                  Overview of Completed vs Incomplete Tasks
                </p>
              </div>
            </div>
            <Bar options={barOptions} data={tasksBarData} />
          </div>

          <div className="chart-holder">
            <div className="d-flex align-items-center gap-3">
              <p className="icon-circle">
                <BiDoughnutChart />
              </p>
              <div>
                <h5 className="mb-0">Your Task Distribution</h5>
                <p className="text-secondary">Tasks Grouped By Status</p>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div style={{ width: "250px" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="charts-container">
        <div className="chart-holder">
          <div className="d-flex align-items-center gap-3">
            <p className="icon-circle">
              <BiBarChartSquare />
            </p>
            <div>
              <h5 className="mb-0">Completion Status</h5>
              <p className="text-secondary">Tasks Completion by Project</p>
            </div>
          </div>
          <Bar options={projectsBarOptions} data={projectsBarData} />
        </div>
        <div className="mx-5">
          <div>
            <h3 className="text-secondary mb-4">Tasks Completed By Teams</h3>
          </div>
          <Bar data={teamBarData} options={teamBarOptions} />{" "}
        </div>
      </div>
    </div>
  );
}
