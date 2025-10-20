import './Mainpage.css';
import { Link } from 'react-router-dom';
export default function Main() {
  return (
    <div>
      <header>
        <h1>Welcome to Main Page</h1>
        <div>
            <Link to="/">
              <button>Login</button>
            </Link>
        </div>
      </header>

      <main>
        <section>
          <h2>Dashboard</h2>
          <div className='Slider-setup'>
            <div className= 'Infoslider'>
              <h3>Profile</h3>
              <p>Manage your account settings</p>
            </div>
            <div className= 'Infoslider'>
              <h3>Lend</h3>
              <p>View Lending options</p>
            </div>
            <div className= 'Infoslider'>
              <h3>Borrow</h3>
              <p>View Borrowing options</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Recent Activity</h2>
          <div>
            <p>No recent activity to display.</p>
          </div>
        </section>
      </main>
    </div>
  );
}