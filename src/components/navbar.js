import { useNavigate, useLocation } from 'react-router-dom'
import logo from "../components/images/logo.png"

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navigate = useNavigate();

    const handleClick = (nav) => {
        navigate(`/${nav}`)
    }
    const links = ["Flights", "Trains", "Buses", "Cabs"];
    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <img
                        src={logo}
                        className="card-img-top"
                        style={{ height: '50px', objectFit: 'cover' }}
                    />
                </div>
                <div className="nav-links">
                    {links.map(linkText => (
                        <button
                            onClick={() => handleClick(linkText.toLowerCase())}
                            className={currentPath === `/${linkText.toLowerCase()}` ? 'active-link' : ''}
                        >
                            {linkText}
                        </button>
                    ))}

                </div>
                <div className="nav-actions d-flex gap-2">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => handleClick('contact')}
                    >
                        Contact Us
                    </button>
                    <button
                        onClick={() => handleClick("login")}
                        className="login-button"
                    >
                        Login
                    </button>
                </div>
                
            </nav>
            <style>{`
                .navbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background-color: #f8f8f8;
                    padding: 10px 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .logo {
                    font-size: 20px;
                    font-weight: bold;
                }
                .nav-links {
                    display: flex;
                    gap: 20px;
                }
                .nav-links a {
                    text-decoration: none;
                    color: #333;
                    font-size: 16px;
                }
                .nav-links button {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    padding: 8px 12px;
                    cursor: pointer;
                    color: #333333;
                    transition: color 0.3s, border-bottom 0.3s;
                    border-bottom: 2px solid transparent;
                }
                .nav-links button:hover {
                    color: #007bff; /* highlight color */
                    border-bottom: 2px solid #007bff;
                }
                .login-button {
                    padding: 5px 15px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .nav-links button.active-link {
                    color: #007bff;
                    border-bottom: 2px solid #007bff;
                }

            `}</style>
        </>
    );
};

export default Navbar;