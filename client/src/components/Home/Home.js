import React from "react";
import "../Home/Home.css";
import { Link } from "react-router-dom";

function Home(props) {
	return (
		<div id="home-container">
			<div id="header">
				<div className="info">
					<h1>Lucid Budget</h1>
					<p>Its time to take control of your spending habits</p>
				</div>

				<div className="btns">
                    <Link to="/howitworks">
					    <button className="btn">Getting Started</button>
				    </Link>
				</div>
			</div>
		</div>
	);
}

export default Home;
