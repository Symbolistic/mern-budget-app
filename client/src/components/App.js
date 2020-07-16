import React from 'react';
import '../App.css';
import { Route, Switch } from "react-router-dom";
import About from "./about";
import Login from "./RegisterLogin";
import Register from "./RegisterLogin/register";
import HomePage from "./HomePage/HomePage";
import Budget from "./BudgetPage/Budget";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={About} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/budget" component={Budget} />
      </Switch>
    </div>
  );
}

export default App;
