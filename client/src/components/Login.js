import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Login extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    axios.post('http://127.0.0.1:5000/auth/login',userData,{
      headers:{"Content-Type": "application/json"}
    })
    .then(res => { 
      if(res.data.success){
        this.setState({
          email:"",
          password:""
        })
        //use react cookies
        this.props.cookies.set('token', res.data.token, { path: '/', maxAge: "31556926" })
        this.props.history.push('/dashboard')
      } 

    })
    .catch(err => {
      this.setState({
        errors:err.response.data
      })
    })
    
  };
  render() {
    if(this.props.cookies.get('token')) return <Redirect to='/dashboard'/>
    const { errors } = this.state;
    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row forms">
          <div className="">
            
            <div className="col s12">
              <h4>
                <b>Login</b>
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                />
                <label htmlFor="email">Email</label>
                <span style={{color:"red"}}>{errors.email}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                />
                <label htmlFor="password">Password</label>
                <span style={{color:"red"}}>{errors.password}</span>
              </div>
              <div className="col s12">
              <p className="grey-text text-darken-1">
                <Link to="/forgot">Forgot password?</Link>
              </p>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginBottom: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(Login)