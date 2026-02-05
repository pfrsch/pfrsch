import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <header>
        <nav>
          <h1>Service Platform</h1>
          <div>
            <Link to="/search">Find Services</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </nav>
      </header>

      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '3em', marginBottom: '20px', color: '#0066ff' }}>
            Connect with Service Professionals
          </h1>
          <p style={{ fontSize: '1.3em', color: '#6c757d', marginBottom: '40px' }}>
            Find skilled professionals for any service you need
          </p>
          <Link to="/search">
            <button className="button button-primary" style={{ fontSize: '1.2em', padding: '15px 40px' }}>
              Start Searching
            </button>
          </Link>
        </div>

        <div style={{ marginTop: '60px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>How It Works</h2>
          <div className="grid">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#0066ff', marginBottom: '15px' }}>1. Search</h3>
              <p>Browse professionals by specialty tags or search by name</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#0066ff', marginBottom: '15px' }}>2. Review</h3>
              <p>Check profiles, ratings, and availability</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#0066ff', marginBottom: '15px' }}>3. Book</h3>
              <p>Schedule an appointment that fits your schedule</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center' }} className="card">
          <h2 style={{ marginBottom: '20px' }}>For Businesses</h2>
          <p style={{ marginBottom: '20px' }}>
            Register your company and manage your team of professionals
          </p>
          <Link to="/dashboard">
            <button className="button button-secondary">
              Business Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
