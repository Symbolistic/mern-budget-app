import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";
import NavBar from "./NavBar/NavBar";
import About from "./about";
import Login from "./RegisterLogin/Login";
import Register from "./RegisterLogin/Register";
import HomePage from "./HomePage/HomePage";
import Budget from "./BudgetPage/Budget";


function App() {
  return (
    <Router>
      <div className="wrapper">
        <NavBar />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/about" component={About} />
            <UnPrivateRoute exact path="/login" component={Login} />
            <UnPrivateRoute exact path="/register" component={Register} />
            <PrivateRoute exact path="/budget" roles={["user", "admin"]} component={Budget} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
