import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthService from "../Services/AuthService";
import { AuthContext } from "../Context/AuthContext";
import "./NavBar.css"

function NavBar(props) {
    const {isAuthenticated, setIsAuthenticated, setUser} = useContext(AuthContext);

    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if(data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
            }
        });
    }

    const unauthenticatedNavBar = () => {
        return (
            <>
                <Link to="/howitworks">
                    <li className="nav-item nav-link">
                        How It Works
                    </li>
                </Link>

                <Link to="/login">
                    <li className="nav-item nav-link">
                        Login
                    </li>
                </Link>
                <Link to="/register">
                    <li className="nav-item nav-link">
                        Register
                    </li>
                </Link>
            </>
        )
    }

    const authenticatedNavBar = () => {
        return (
            <>
                <Link to="/howitworks">
                    <li className="nav-item nav-link">
                        How It Works
                    </li>
                </Link>

                <Link to="/budget">
                    <li className="nav-item nav-link">
                        Budget
                    </li>
                </Link>

                <button type="button" className="logout-btn" onClick={onClickLogoutHandler}>Logout</button>
            </>
        )
    }

    return (
        <div className="nav-container">
            <Link to='/'>
                <div className="app-name">
                    <h2>Lucid Budget</h2>
                </div>
            </Link>
            
            <div id="navbarText">
				<ul className="navbar-links">
					{ !isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar() }
				</ul>
				<span className="navbar-text"></span>
			</div>
        </div>
    );
}

export default NavBar;