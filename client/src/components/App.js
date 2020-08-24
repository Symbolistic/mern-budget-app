import React from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";
import NavBar from "./NavBar/NavBar";
import About from "./about";
import Home from "./Home/Home";
import HowItWorks from "./HowItWorks/HowItWorks";
import Register from "./UserAuth/Register";
import Login from "./UserAuth/Login";
import ForgotPassword from "./UserAuth/ForgotPassword";
import ResetPassword from "./UserAuth/ResetPassword";
import Budget from "./BudgetPage/Budget";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/howitworks" component={HowItWorks} />
          <UnPrivateRoute exact path="/login" component={Login} />
          <UnPrivateRoute exact path="/register" component={Register} />
          <UnPrivateRoute exact path="/forgot" component={ForgotPassword} />
          <UnPrivateRoute exact path="/reset/:id" component={ResetPassword} />
          <PrivateRoute
            exact
            path="/budget"
            roles={["user", "admin"]}
            component={Budget}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
