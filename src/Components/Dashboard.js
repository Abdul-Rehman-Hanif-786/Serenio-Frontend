import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import api from '../api/axios';
import Loader from './Loader';

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [toggleHovered, setToggleHovered] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get("/dashboard/stats");
        const logsRes = await api.get("/dashboard/activity");
        const usersRes = await api.get("/dashboard/users");

        setStats(statsRes.data);
        setActivityLogs(logsRes.data);
        setUserList(usersRes.data);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.setItem("loginMessage", "Session expired. Please login again.");
          navigate('/login');
        }
      } finally {
        setLoadingPage(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error("Export error", err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleAddUser = async () => {
    setAddUserLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error("Add user error", err);
    } finally {
      setAddUserLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="full-page-loader">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {sidebarVisible && (
        <aside className="sidebar">
          {/* <div className="sidebar-header">
            <img src={require("../assets/DashboardLogo.png")} alt="logo" className="logo-img" />
          </div> */}
          <nav className="sidebar-nav">
            <ul>
              <li><a href="/DashboardHome">Home</a></li>
              <li><a href="/Professionals">Professionals</a></li>
              <li><a href="/SentimentAnalysis">Sentiment Analysis</a></li>
              <li><a href="/profile">Profile setting</a></li>
              <li><a href="/Logs">SystemMonitoringLogs</a></li>
            </ul>
          </nav>
        </aside>
      )}

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Monitor user activities and manage system logs</p>
        </div>

        <div
          className="sidebar-toggle-container"
          onMouseEnter={() => setToggleHovered(true)}
          onMouseLeave={() => setToggleHovered(false)}
        >
          {toggleHovered && (
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarVisible((prev) => !prev)}
            >
              &#9776;
            </button>
          )}
        </div>

        <div className="dashboard-cards">
          <div className="card"><p>Total Users</p><h2>{stats.totalUsers || 'Loading...'}</h2></div>
          <div className="card"><p>Active Sessions</p><h2>{stats.activeSessions || 'Loading...'}</h2></div>
          <div className="card"><p>Today's Actions</p><h2>{stats.todaysActions || 'Loading...'}</h2></div>
          <div className="card"><p>System Health</p><h2 className="success">{stats.systemHealth || 'Loading...'}</h2></div>
        </div>

        <div className="activity-section">
          <div className="section-header">
            <h3>Activity Logs</h3>
            <div className="actions">
              <input type="text" placeholder="Search logs..." />
              <select><option>All Roles</option></select>
              <select><option>All Actions</option></select>
              <button className="export-btn" onClick={handleExport} disabled={exportLoading}>
                {exportLoading ? <Loader size={16} /> : "Export"}
              </button>
            </div>
          </div>

          <table className="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.length > 0 ? (
                activityLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td><strong>{log.name}</strong><br />{log.email}</td>
                    <td><span className={`badge ${log.role.toLowerCase()}`}>{log.role}</span></td>
                    <td>{log.action}</td>
                    <td>{log.timestamp}</td>
                    <td><span className={`status ${log.status.toLowerCase()}`}>{log.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">Loading...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="user-management">
          <div className="section-header">
            <h3>User Management</h3>
            <div className="actions">
              <input type="text" placeholder="Search users..." />
              <select><option>All Status</option></select>
              <button className="add-user" onClick={handleAddUser} disabled={addUserLoading}>
                {addUserLoading ? <Loader size={16} /> : "+ Add User"}
              </button>
            </div>
          </div>

          <table className="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.length > 0 ? (
                userList.map((user, idx) => (
                  <tr key={idx}>
                    <td><strong>{user.name}</strong><br />{user.email}</td>
                    <td><span className={`badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                    <td>{user.lastActive}</td>
                    <td><span className={`status ${user.status.toLowerCase()}`}>{user.status}</span></td>
                    <td>
                      <span className="action-btn">Edit</span>{" "}
                      <span className="action-btn danger">Suspend</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">Loading users...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
