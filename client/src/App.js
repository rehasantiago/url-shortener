import React,{ Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import Navbar from "./components/Navbar"
import Dashboard from './components/Dashboard';

class App extends Component{
    render(){
        return(
            <>
            <Router>
                <Navbar/>
                <div>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/dashboard" component={Dashboard} />
                </div>
            </Router>
            </>
        )
    }
}

export default App