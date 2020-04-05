import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Register extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password1: "",
      password2: "",
      errors: {}
    };
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password1: this.state.password1,
      password2: this.state.password2
    };
    axios.post('http://127.0.0.1:5000/auth/register',newUser,{
      headers:{"Content-Type": "application/json"}
    })
    .then(res => {
      if(res.data.success){
        this.setState({
          name:"",
          email:"",
          password1:"",
          password2:""
        })
        const token = res.data.token
        //use react cookies
        this.props.cookies.set('token', res.data.token, { path: '/', maxAge: "31556926" })
        this.props.setCurrentUser(res.data.user,res.data.token);
        this.props.history.push('/dashboard');
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
        <div className="row forms">
          <div className="col s8">
            <div className="col s12">
              <h4>
                <b>Register</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                />
                <label htmlFor="name">Name</label>
                <span style={{color:"red"}}>{errors.name}</span>
              </div>
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
                  value={this.state.password1}
                  error={errors.password1}
                  id="password"
                  type="password"
                />
                <label htmlFor="password">Password</label>
                <span style={{color:"red"}}>{errors.password1}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                />
                <label htmlFor="password2">Confirm Password</label>
                <span style={{color:"red"}}>{errors.password2}</span>
              </div>
              <div className="col s12" style={{  }}>
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
                  Sign up
                </button>
                <br/>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(Register)