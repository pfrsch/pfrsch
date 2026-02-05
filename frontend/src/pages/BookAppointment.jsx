import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeAPI, appointmentAPI } from '../services/api';

function BookAppointment() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    date: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  useEffect(() => {
    loadEmployee();
  }, [employeeId]);

  const loadEmployee = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getById(employeeId);
      setEmployee(response.data);
    } catch (err) {
      setError('Failed to load employee information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Combine date and time
      const startTimestamp = `${formData.date}T${formData.start_time}:00`;
      const endTimestamp = `${formData.date}T${formData.end_time}:00`;

      await appointmentAPI.create({
        employee_id: employeeId,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        description: formData.description
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/search');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment');
      console.error(err);
    } finally {
      setSubmitting(false);
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

  if (!employee) {
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
          <div className="error">Employee not found</div>
          <Link to="/search">
            <button className="button button-secondary">Back to Search</button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
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
          <div className="success">
            <h2>Appointment Booked Successfully!</h2>
            <p>You will receive a confirmation email shortly.</p>
            <p>Redirecting to search...</p>
          </div>
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
            <Link to={`/employee/${employeeId}`}>Back to Profile</Link>
          </div>
        </nav>
      </header>

      <div className="container">
        <div className="card">
          <h1>Book Appointment with {employee.name}</h1>
          <p style={{ color: '#6c757d', marginTop: '10px' }}>
            {employee.company_name}
          </p>

          {error && <div className="error" style={{ marginTop: '20px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Email *</label>
              <input
                type="email"
                name="client_email"
                value={formData.client_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Phone</label>
              <input
                type="tel"
                name="client_phone"
                value={formData.client_phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what service you need..."
              />
            </div>

            <button 
              type="submit" 
              className="button button-primary"
              disabled={submitting}
              style={{ fontSize: '1.1em', padding: '12px 30px' }}
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
