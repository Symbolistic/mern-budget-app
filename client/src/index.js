import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './components/App';
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/Context/AuthContext";

//import 'materialize-css/dist/css/materialize.min.css';


ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);
