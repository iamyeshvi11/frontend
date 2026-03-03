import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminReports.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for different reports
  const [overviewStats, setOverviewStats] = useState(null);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [riskStats, setRiskStats] = useState([]);
  const [overdueEmployees, setOverdueEmployees] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [employeeStats, setEmployeeStats] = useState([]);
  const [trendStats, setTrendStats] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch all reports in parallel
      const [overview, department, risk, overdue, course, employee, trends] = await Promise.all([
        axios.get(`${API_URL}/reports/overview`, config),
        axios.get(`${API_URL}/reports/department-stats`, config),
        axios.get(`${API_URL}/reports/risk-compliance`, config),
        axios.get(`${API_URL}/reports/overdue-employees`, config),
        axios.get(`${API_URL}/reports/course-stats`, config),
        axios.get(`${API_URL}/reports/employee-stats`, config),
        axios.get(`${API_URL}/reports/trends?period=30`, config)
      ]);

      setOverviewStats(overview.data.data);
      setDepartmentStats(department.data.data);
      setRiskStats(risk.data.data);
      setOverdueEmployees(overdue.data.data);
      setCourseStats(course.data.data);
      setEmployeeStats(employee.data.data);
      setTrendStats(trends.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reports/export?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Convert to CSV and download
      const data = response.data.data;
      const csv = convertToCSV(data);
      downloadCSV(csv, `${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report');
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="admin-reports">
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="admin-reports">
      <div className="reports-header">
        <h1>Training Reports & Analytics</h1>
        <button className="btn btn-refresh" onClick={fetchReports}>
          🔄 Refresh Data
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="report-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'department' ? 'active' : ''}`}
          onClick={() => setActiveTab('department')}
        >
          🏢 Departments
        </button>
        <button
          className={`tab-btn ${activeTab === 'risk' ? 'active' : ''}`}
          onClick={() => setActiveTab('risk')}
        >
          ⚠️ Risk Compliance
        </button>
        <button
          className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          ⏰ Overdue
        </button>
        <button
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          📚 Courses
        </button>
        <button
          className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          👥 Employees
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && overviewStats && (
        <div className="report-content">
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">📚</div>
              <div className="stat-details">
                <h3>Total Courses</h3>
                <p className="stat-value">{overviewStats.totalCourses}</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <h3>Total Employees</h3>
                <p className="stat-value">{overviewStats.totalEmployees}</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">📝</div>
              <div className="stat-details">
                <h3>Total Assignments</h3>
                <p className="stat-value">{overviewStats.totalAssignments}</p>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <h3>Completed</h3>
                <p className="stat-value">{overviewStats.completedAssignments}</p>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-details">
                <h3>In Progress</h3>
                <p className="stat-value">{overviewStats.inProgressAssignments}</p>
              </div>
            </div>

            <div className="stat-card danger">
              <div className="stat-icon">⚠️</div>
              <div className="stat-details">
                <h3>Overdue</h3>
                <p className="stat-value">{overviewStats.overdueAssignments}</p>
                <p className="stat-subtitle">{overviewStats.overdueEmployees} employees</p>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <h3>Completion Rate</h3>
                <p className="stat-value">{overviewStats.completionPercentage}%</p>
              </div>
            </div>

            <div className="stat-card gold">
              <div className="stat-icon">🎯</div>
              <div className="stat-details">
                <h3>Average Score</h3>
                <p className="stat-value">{overviewStats.averageScore}%</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="completion-chart">
            <h3>Overall Completion Progress</h3>
            <div className="progress-container">
              <div className="progress-bar-large">
                <div 
                  className="progress-fill"
                  style={{ width: `${overviewStats.completionPercentage}%` }}
                >
                  <span className="progress-text">{overviewStats.completionPercentage}%</span>
                </div>
              </div>
              <div className="progress-legend">
                <span className="legend-item completed">
                  {overviewStats.completedAssignments} Completed
                </span>
                <span className="legend-item pending">
                  {overviewStats.totalAssignments - overviewStats.completedAssignments} Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Stats Tab */}
      {activeTab === 'department' && (
        <div className="report-content">
          <div className="section-header">
            <h2>Department-wise Statistics</h2>
            <button className="btn btn-export" onClick={() => handleExport('department')}>
              📥 Export CSV
            </button>
          </div>
          
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Total Assigned</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Failed</th>
                  <th>Overdue</th>
                  <th>Completion %</th>
                  <th>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, index) => (
                  <tr key={index}>
                    <td className="dept-name">{dept.department || 'N/A'}</td>
                    <td>{dept.totalEmployees}</td>
                    <td>{dept.totalAssignments}</td>
                    <td className="success-text">{dept.completedAssignments}</td>
                    <td className="warning-text">{dept.inProgressAssignments}</td>
                    <td className="danger-text">{dept.failedAssignments}</td>
                    <td className="danger-text">{dept.overdueAssignments}</td>
                    <td>
                      <div className="progress-cell">
                        <span>{dept.completionPercentage}%</span>
                        <div className="mini-progress">
                          <div 
                            className="mini-progress-fill"
                            style={{ width: `${dept.completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>{dept.averageScore || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk Compliance Tab */}
      {activeTab === 'risk' && (
        <div className="report-content">
          <div className="section-header">
            <h2>Risk-Level Compliance Statistics</h2>
          </div>

          <div className="risk-cards">
            {riskStats.map((risk, index) => (
              <div key={index} className={`risk-card risk-${risk.riskLevel.toLowerCase()}`}>
                <div className="risk-header">
                  <h3>{risk.riskLevel} Risk</h3>
                  <span className="risk-compliance">{risk.complianceRate}%</span>
                </div>
                
                <div className="risk-stats">
                  <div className="risk-stat-item">
                    <span className="label">Courses:</span>
                    <span className="value">{risk.totalCourses}</span>
                  </div>
                  <div className="risk-stat-item">
                    <span className="label">Employees:</span>
                    <span className="value">{risk.totalEmployees}</span>
                  </div>
                  <div className="risk-stat-item">
                    <span className="label">Assignments:</span>
                    <span className="value">{risk.totalAssignments}</span>
                  </div>
                  <div className="risk-stat-item">
                    <span className="label">Completed:</span>
                    <span className="value success-text">{risk.completedAssignments}</span>
                  </div>
                  <div className="risk-stat-item">
                    <span className="label">Overdue:</span>
                    <span className="value danger-text">{risk.overdueAssignments}</span>
                  </div>
                  <div className="risk-stat-item">
                    <span className="label">Avg Score:</span>
                    <span className="value">{risk.averageScore || 0}%</span>
                  </div>
                </div>

                <div className="risk-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${risk.complianceRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue Employees Tab */}
      {activeTab === 'overdue' && (
        <div className="report-content">
          <div className="section-header">
            <h2>Overdue Employees</h2>
            <div className="overdue-summary">
              <span className="summary-badge danger">
                {overdueEmployees.length} employees with overdue courses
              </span>
            </div>
          </div>

          {overdueEmployees.length === 0 ? (
            <div className="empty-state">
              <p>🎉 No overdue assignments! Everyone is on track.</p>
            </div>
          ) : (
            <div className="overdue-list">
              {overdueEmployees.map((employee, index) => (
                <div key={index} className="overdue-card">
                  <div className="employee-info">
                    <h4>{employee.employeeName}</h4>
                    <p className="employee-email">{employee.employeeEmail}</p>
                    <span className="department-badge">{employee.department}</span>
                    <span className="overdue-count">
                      {employee.totalOverdue} overdue course{employee.totalOverdue > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="overdue-courses">
                    {employee.overdueCourses.map((course, idx) => (
                      <div key={idx} className="overdue-course-item">
                        <div className="course-title">{course.courseTitle}</div>
                        <div className="course-details">
                          <span className={`risk-badge ${course.riskLevel.toLowerCase()}`}>
                            {course.riskLevel}
                          </span>
                          <span className="deadline">
                            Due: {new Date(course.deadline).toLocaleDateString()}
                          </span>
                          <span className="days-overdue danger-text">
                            {course.daysOverdue} days overdue
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Course Stats Tab */}
      {activeTab === 'courses' && (
        <div className="report-content">
          <div className="section-header">
            <h2>Course-wise Statistics</h2>
            <button className="btn btn-export" onClick={() => handleExport('courses')}>
              📥 Export CSV
            </button>
          </div>

          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Risk Level</th>
                  <th>Pass %</th>
                  <th>Assigned</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Failed</th>
                  <th>Completion Rate</th>
                  <th>Avg Score</th>
                  <th>Attempts</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.map((course, index) => (
                  <tr key={index}>
                    <td className="course-title-cell">{course.courseTitle}</td>
                    <td>
                      <span className={`badge badge-${course.riskLevel.toLowerCase()}`}>
                        {course.riskLevel}
                      </span>
                    </td>
                    <td>{course.passThreshold}%</td>
                    <td>{course.totalAssignments}</td>
                    <td className="success-text">{course.completedAssignments}</td>
                    <td className="warning-text">{course.inProgressAssignments}</td>
                    <td className="danger-text">{course.failedAssignments}</td>
                    <td>
                      <div className="progress-cell">
                        <span>{course.completionRate}%</span>
                        <div className="mini-progress">
                          <div 
                            className="mini-progress-fill"
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>{course.averageScore || 0}%</td>
                    <td>{course.totalAttempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Stats Tab */}
      {activeTab === 'employees' && (
        <div className="report-content">
          <div className="section-header">
            <h2>Employee-wise Statistics</h2>
            <button className="btn btn-export" onClick={() => handleExport('employees')}>
              📥 Export CSV
            </button>
          </div>

          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Assigned</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Failed</th>
                  <th>Overdue</th>
                  <th>Completion %</th>
                  <th>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {employeeStats.map((employee, index) => (
                  <tr key={index}>
                    <td className="employee-name-cell">{employee.employeeName}</td>
                    <td>{employee.employeeEmail}</td>
                    <td>{employee.department}</td>
                    <td>{employee.totalAssignments}</td>
                    <td className="success-text">{employee.completedAssignments}</td>
                    <td className="warning-text">{employee.inProgressAssignments}</td>
                    <td className="danger-text">{employee.failedAssignments}</td>
                    <td className="danger-text">{employee.overdueAssignments}</td>
                    <td>
                      <div className="progress-cell">
                        <span>{employee.completionRate}%</span>
                        <div className="mini-progress">
                          <div 
                            className="mini-progress-fill"
                            style={{ width: `${employee.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>{employee.averageScore || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
