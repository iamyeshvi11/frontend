import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageAssignments.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ManageAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Form state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    fetchData();
    
    // Check if course is pre-selected from URL
    const params = new URLSearchParams(window.location.search);
    const courseFromUrl = params.get('course');
    if (courseFromUrl) {
      setSelectedCourse(courseFromUrl);
      setShowAssignModal(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch each separately to handle errors better
      let coursesData = [];
      let employeesData = [];
      let assignmentsData = [];

      try {
        const coursesRes = await axios.get(`${API_URL}/courses`, config);
        coursesData = coursesRes.data.data || [];
      } catch (err) {
        console.error('Error fetching courses:', err);
        alert('Failed to fetch courses: ' + (err.response?.data?.message || err.message));
      }

      try {
        const employeesRes = await axios.get(`${API_URL}/users`, config);
        // Filter employees only
        employeesData = (employeesRes.data.data || []).filter(u => u.role === 'employee');
      } catch (err) {
        console.error('Error fetching employees:', err);
        alert('Failed to fetch employees: ' + (err.response?.data?.message || err.message));
      }

      try {
        const assignmentsRes = await axios.get(`${API_URL}/courses/assignments`, config);
        assignmentsData = assignmentsRes.data.data || [];
      } catch (err) {
        console.error('Error fetching assignments:', err);
        alert('Failed to fetch assignments: ' + (err.response?.data?.message || err.message));
      }

      setCourses(coursesData);
      setEmployees(employeesData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCourse = async () => {
    if (!selectedCourse || selectedEmployees.length === 0 || !deadline) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/courses/assign`,
        {
          courseId: selectedCourse,
          employeeIds: selectedEmployees,
          deadline,
          notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Successfully assigned course to ${response.data.data.length} employee(s)`);
      
      // Reset form
      setSelectedCourse('');
      setSelectedEmployees([]);
      setDeadline('');
      setNotes('');
      setShowAssignModal(false);
      
      // Refresh assignments
      fetchData();
    } catch (error) {
      console.error('Error assigning course:', error);
      alert(error.response?.data?.message || 'Failed to assign course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmployeeToggle = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e._id));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Assigned': 'badge-info',
      'In Progress': 'badge-warning',
      'Completed': 'badge-success',
      'Failed': 'badge-danger'
    };
    return <span className={`badge ${badges[status]}`}>{status}</span>;
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filterStatus !== 'all' && assignment.status !== filterStatus) return false;
    if (filterCourse !== 'all' && assignment.courseId._id !== filterCourse) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="manage-assignments">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="manage-assignments">
      <div className="page-header">
        <div>
          <h1>Manage Assignments</h1>
          <p>Assign courses to employees and track progress</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAssignModal(true)}
        >
          + Assign Course
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Assignments</h3>
            <p className="stat-number">{assignments.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">
              {assignments.filter(a => a.status === 'Completed').length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">
              {assignments.filter(a => a.status === 'In Progress').length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <p className="stat-number">
              {assignments.filter(a => a.isOverdue).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Course:</label>
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-secondary" onClick={() => {
          setFilterStatus('all');
          setFilterCourse('all');
        }}>
          Clear Filters
        </button>
      </div>

      {/* Assignments Table */}
      <div className="assignments-table-container">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Course</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Score</th>
              <th>Deadline</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No assignments found
                </td>
              </tr>
            ) : (
              filteredAssignments.map(assignment => (
                <tr key={assignment._id}>
                  <td>
                    <div className="employee-info">
                      <strong>{assignment.employeeId.name}</strong>
                      <small>{assignment.employeeId.department}</small>
                    </div>
                  </td>
                  <td>{assignment.courseId.title}</td>
                  <td>
                    <span className={`badge badge-${assignment.courseId.riskLevel.toLowerCase()}`}>
                      {assignment.courseId.riskLevel}
                    </span>
                  </td>
                  <td>{getStatusBadge(assignment.status)}</td>
                  <td>
                    {assignment.score !== null ? `${assignment.score}%` : '-'}
                  </td>
                  <td>
                    <div className={assignment.isOverdue ? 'text-danger' : ''}>
                      {new Date(assignment.deadline).toLocaleDateString()}
                      {assignment.isOverdue && <div className="overdue-label">Overdue</div>}
                    </div>
                  </td>
                  <td>{new Date(assignment.assignedAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => window.open(`/admin/assignments/${assignment._id}`, '_blank')}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Course Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Course to Employees</h2>
              <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Select Course */}
              <div className="form-group">
                <label>Select Course *</label>
                <select 
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="form-control"
                >
                  <option value="">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title} ({course.riskLevel} Risk)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Employees */}
              <div className="form-group">
                <div className="label-with-action">
                  <label>Select Employees * ({selectedEmployees.length} selected)</label>
                  <button 
                    type="button"
                    className="btn-link"
                    onClick={handleSelectAllEmployees}
                  >
                    {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="employees-list">
                  {employees.map(employee => (
                    <label key={employee._id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee._id)}
                        onChange={() => handleEmployeeToggle(employee._id)}
                      />
                      <span>{employee.name} - {employee.department}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="form-group">
                <label>Deadline *</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-control"
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAssignModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAssignCourse}
                disabled={submitting}
              >
                {submitting ? 'Assigning...' : 'Assign Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAssignments;
