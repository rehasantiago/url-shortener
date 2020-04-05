import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Parser from 'html-react-parser';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import './Navbar.css'

class Dashboard extends Component{

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(){
        super()
        this.state = {
            enterUrl: "",
            urls: null,
            errors: null,
            shortUrl:''
        }
    }
    componentDidMount(){
        axios.get('http://127.0.0.1:5000/items',
        axios.defaults.headers.common['authorization'] = this.props.cookies.get('token'),
        {
            headers:{"Content-Type": "application/json"}
        })
        .then(res => {
            if(res.data.success){
                this.setState({
                    urls: res.data.urls
                })
            }
        })
    }
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    onSubmit = e => {
        e.preventDefault();
        this.setState({
            shortUrl:''
        })
        const newUrl = {
            originalUrl: this.state.enterUrl
        }
        axios.post('http://127.0.0.1:5000/item', newUrl,
        axios.defaults.headers.common['authorization'] = this.props.cookies.get('token'),
        {
            headers:{"Content-Type": "application/json"}
        })
        .then(res => {
            this.setState({
                enterUrl: "",
                shortUrl:`The shortened URL is <a href=${res.data.shortUrl}>${res.data.shortUrl}</a>`,
            })
            if(res.data.newUrl){
                this.setState({
                    urls: [...this.state.urls, res.data.newUrl]
                })
            }
        })
        .catch(err =>{
            this.setState({
                errors: err.response.data.url
            })
        })
    }
    render(){
        if(!this.props.cookies.get('token')) return <Redirect to='/login'/>
        const { urls,shortUrl,errors } = this.state
        if(!urls) return <div>Loading</div>
        return(
            <div className="container">
                <br/>
                <div className='' style={{textAlign: 'center'}}>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group ">
                            <input type="text" className="form-control" id="enterUrl" placeholder="Enter URL" onChange={this.onChange}
                            value={this.state.enterUrl}
                            />
                            <span style={{color:"red"}}>{errors}</span>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                        <span>{Parser(shortUrl)}</span>
                    </form>
                </div>
                <br/>
                <div className='' style={{overflowX: 'auto'}}>
                    <table className='table table-bordered'>
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Original url</th>
                                <th scope="col">shortened Url</th>
                                <th scope="col">No of clicks</th>
                                <th scope="col">Created at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                urls.map((url,index) => {
                                    const date = new Date(url.createdAt)
                                    return(
                                        <tr key={index}>
                                            <td><a href={url.originalUrl}>{url.originalUrl}</a></td>
                                            <td><a href={url.shortUrl}>{url.shortUrl}</a></td>
                                            <td>{url.noOfClicks}</td>
                                            <td>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    </div>
                <br/>
                
            </div>
        )
    }
}

export default withCookies(Dashboard) 