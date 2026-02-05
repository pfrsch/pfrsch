import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI, companyAPI } from '../services/api';

function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('employees');
  const [applications, setApplications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock company ID - in real app, get from auth context
  const companyId = 1;

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'applications') {
        const response = await employeeAPI.getApplications(companyId, 'pending');
        setApplications(response.data);
      } else if (activeTab === 'employees') {
        const response = await employeeAPI.getAll({ company_id: companyId });
        setEmployees(response.data);
      } else if (activeTab === 'settings') {
        const response = await companyAPI.getById(companyId);
        setCompany(response.data);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await employeeAPI.approveApplication(applicationId);
      setSuccess('Application approved successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to approve application');
      console.error(err);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await employeeAPI.rejectApplication(applicationId);
      setSuccess('Application rejected');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to reject application');
      console.error(err);
    }
  };

  return (
    <div>
      <header>
        <nav>
          <Link to="/">
            <h1>Service Platform</h1>
          </Link>
          <div>
            <Link to="/search">Find Services</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </nav>
      </header>

      <div className="container">
        <h1>Company Dashboard</h1>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="card">
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <button
              className={`button ${activeTab === 'employees' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
            <button
              className={`button ${activeTab === 'applications' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications ({applications.length})
            </button>
            <button
              className={`button ${activeTab === 'settings' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div style={{ marginTop: '20px' }}>
              {activeTab === 'employees' && (
                <div>
                  <h2>Your Team</h2>
                  {employees.length === 0 ? (
                    <p style={{ color: '#6c757d', marginTop: '15px' }}>No employees yet.</p>
                  ) : (
                    <div style={{ marginTop: '20px' }}>
                      {employees.map(emp => (
                        <div key={emp.id} className="card" style={{ marginBottom: '15px' }}>
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            {emp.photo_url ? (
                              <img 
                                src={emp.photo_url} 
                                alt={emp.name}
                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: '#ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5em'
                              }}>
                                {emp.name[0]}
                              </div>
                            )}
                            <div>
                              <h3>{emp.name}</h3>
                              {emp.tags && emp.tags[0] && (
                                <div className="tags" style={{ marginTop: '5px' }}>
                                  {emp.tags.filter(t => t).map((tag, idx) => (
                                    <span key={idx} className="tag">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'applications' && (
                <div>
                  <h2>Pending Applications</h2>
                  {applications.length === 0 ? (
                    <p style={{ color: '#6c757d', marginTop: '15px' }}>No pending applications.</p>
                  ) : (
                    <div style={{ marginTop: '20px' }}>
                      {applications.map(app => (
                        <div key={app.id} className="card" style={{ marginBottom: '15px' }}>
                          <h3>{app.name}</h3>
                          <p style={{ marginTop: '5px' }}>Email: {app.email}</p>
                          {app.phone && <p>Phone: {app.phone}</p>}
                          {app.bio && <p style={{ marginTop: '10px' }}>{app.bio}</p>}
                          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button
                              className="button button-success"
                              onClick={() => handleApprove(app.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="button button-danger"
                              onClick={() => handleReject(app.id)}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2>Company Settings</h2>
                  <p style={{ color: '#6c757d', marginTop: '15px' }}>
                    Customize your company profile, theme, and branding here.
                  </p>
                  <div style={{ marginTop: '20px' }}>
                    <h3>Theme Customization</h3>
                    <p style={{ marginTop: '10px', color: '#6c757d' }}>
                      Feature coming soon: Customize colors, logo, and site appearance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
