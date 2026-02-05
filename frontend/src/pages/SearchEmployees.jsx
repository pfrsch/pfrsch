import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { employeeAPI, tagAPI } from '../services/api';

function SearchEmployees() {
  const [employees, setEmployees] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTags();
    loadEmployees();
  }, []);

  const loadTags = async () => {
    try {
      const response = await tagAPI.getAll();
      setTags(response.data);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const loadEmployees = async (tagId = null) => {
    setLoading(true);
    setError('');
    try {
      const params = tagId ? { tag_id: tagId } : {};
      const response = await employeeAPI.getAll(params);
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagFilter = (e) => {
    const tagId = e.target.value;
    setSelectedTag(tagId);
    loadEmployees(tagId || null);
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
        <h1>Find Service Professionals</h1>

        <div className="card">
          <div className="form-group">
            <label>Filter by Specialty:</label>
            <select value={selectedTag} onChange={handleTagFilter}>
              <option value="">All Specialties</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No professionals found. Try a different filter.</p>
          </div>
        ) : (
          <div className="grid">
            {employees.map(employee => (
              <div 
                key={employee.id} 
                className="employee-card"
                onClick={() => navigate(`/employee/${employee.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {employee.photo_url ? (
                  <img src={employee.photo_url} alt={employee.name} />
                ) : (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#ddd',
                    margin: '0 auto 15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2em',
                    color: '#666'
                  }}>
                    {employee.name[0]}
                  </div>
                )}
                <h3>{employee.name}</h3>
                <p style={{ color: '#6c757d', marginTop: '5px' }}>
                  {employee.company_name}
                </p>
                {employee.hourly_rate && (
                  <p style={{ color: '#0066ff', fontWeight: 'bold', marginTop: '10px' }}>
                    ${employee.hourly_rate}/hr
                  </p>
                )}
                {employee.tags && employee.tags[0] && (
                  <div className="tags">
                    {employee.tags.filter(t => t).map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchEmployees;
