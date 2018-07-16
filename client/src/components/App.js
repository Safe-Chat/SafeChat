import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {Header} from './Header';

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    return(
      <Router>
        <div>
          <Header/>
          <div>Hello</div>
        </div>
      </Router>
    )
  }
}