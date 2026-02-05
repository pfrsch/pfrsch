import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await employeeAPI.getById(id);
      setEmployee(response.data);
    } catch (err) {
      setError('Failed to load employee profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <header>
          <nav>
            <Link to="/">
              <h1>Service Platform</h1>
            </Link>
          </nav>
        </header>
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div>
        <header>
          <nav>
            <Link to="/">
              <h1>Service Platform</h1>
            </Link>
          </nav>
        </header>
        <div className="container">
          <div className="error">{error || 'Employee not found'}</div>
          <Link to="/search">
            <button className="button button-secondary">Back to Search</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <nav>
          <Link to="/">
            <h1>Service Platform</h1>
          </Link>
          <div>
            <Link to="/search">Back to Search</Link>
          </div>
        </nav>
      </header>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', gap: '30px', alignItems: 'start' }}>
            <div>
              {employee.photo_url ? (
                <img 
                  src={employee.photo_url} 
                  alt={employee.name}
                  style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: '#ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4em',
                  color: '#666'
                }}>
                  {employee.name[0]}
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h1>{employee.name}</h1>
              <p style={{ color: '#6c757d', fontSize: '1.1em', marginTop: '10px' }}>
                {employee.company_name}
              </p>

              {employee.hourly_rate && (
                <p style={{ color: '#0066ff', fontSize: '1.5em', fontWeight: 'bold', marginTop: '15px' }}>
                  ${employee.hourly_rate}/hour
                </p>
              )}

              {employee.tags && employee.tags[0] && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Specialties</h3>
                  <div className="tags" style={{ marginTop: '10px' }}>
                    {employee.tags.filter(t => t).map((tag, idx) => (
                      <span key={idx} className="tag" style={{ fontSize: '14px', padding: '6px 15px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {employee.bio && (
                <div style={{ marginTop: '20px' }}>
                  <h3>About</h3>
                  <p style={{ marginTop: '10px', lineHeight: '1.6' }}>{employee.bio}</p>
                </div>
              )}

              <div style={{ marginTop: '30px' }}>
                <button 
                  className="button button-primary"
                  style={{ fontSize: '1.1em', padding: '12px 30px' }}
                  onClick={() => navigate(`/book/${employee.id}`)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        {employee.availability && employee.availability.length > 0 && (
          <div className="card">
            <h2>Availability</h2>
            <div style={{ marginTop: '15px' }}>
              {employee.availability.map((avail, idx) => {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return (
                  <p key={idx} style={{ marginBottom: '8px' }}>
                    <strong>{days[avail.weekday]}:</strong> {avail.start_time} - {avail.end_time}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeProfile;
