import React, { Component } from 'react';
import axios from 'axios';
import Sentiment from 'sentiment';
import { Table } from 'react-bootstrap';

import NewMessage from './NewMessage.jsx';
import Message from './Message.jsx';
import Title from './Title.jsx';
import { resolve } from 'path';

export default class Chat extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeRoom: 'lobby',
      activeRoomId: 1,
      rooms: ['lobby', 'theOtherRoom'],
      // roomId: 1,
      roomScore: 0,
      messages: [],
      newMessageText: '',
      messageScore: 0,
      mood: 'neutral',
      moods: ['negative', 'neutral', 'positive']
    }

    this.handleChange = this.handleChange.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.refreshInput = this.refreshInput.bind(this);
    this.setMood = this.setMood.bind(this);
  }

  componentDidMount = () => {
    this.getMessages();
    this.setMood();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    console.log('test')
    return (this.state !== nextState);
  }

  componentWillUpdate = () => {
    
  }

  getMessages = (activeRoom=this.state.activeRoom) => {
    axios.get('/messages', {
      params: {
        activeRoom: activeRoom
      }})
      .then(res => { // Checks each message from server against activeRoomId
        // and filters out the ones that don't match, messages for the active
        // room are stored in state.messages
        var msgs;
        if(res.data){
          msgs = res.data.reverse().filter(msg => {
            return (msg.roomId === this.state.activeRoomId);
          });
        }
        this.setState({
          messages: msgs
        }, console.log(msgs));
      })
      .catch(err => {console.error(err)})
  }

  handleChange = (event) => {
    this.setState({
        newMessageText: event.target.value
    });
  }

  refreshInput = () => {this.setState({newMessageText: ''});}

  postMessage = () => {
    axios.post('/messages', {
      roomId: this.state.activeRoomId,
      userId: this.props.userData.id,
      username: this.props.userData.username,
      text: this.state.newMessageText,
      score: this.state.messageScore,
      roomname: this.state.activeRoom
    })
      .then(res => {
        console.log('new message POSTed to /messages');
        this.refreshInput();
        this.getMessages();
        this.setMood();
      })
      .catch(err => {console.error(err)});
  }

  changeRoom = (event) => {
    this.setState({
      activeRoom: event.target.value
    });
    this.getMessages(event.target.value);
  }

  setMood = () => {
    if (this.state.roomScore >= 0) {
      var newMoodIdx = 2;
    } else {
      var newMoodIdx = 0;
    }
    this.setState({
      mood: this.state.moods[newMoodIdx]
    }, () => {
      console.log(this.state.mood);
    });
  }


  render() {

    return (
      <div >
        <Title user={this.props.userData.username} room={this.state.activeRoom} score={this.state.roomScore} rooms={this.state.rooms} changeRoom={this.changeRoom}/>
        <NewMessage text={this.state.newMessageText} handleChange={this.handleChange} postMessage={this.postMessage} refresh={this.refresh}/>
        <div className={this.state.mood} >
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>
                  {this.state.activeRoom}
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.messages.map((message, index) => 
                <Message key={index} messageData={message} user={this.state.user}/>
              )}
            </tbody>
          </Table>
          
        </div>
      </div>
    )
  }
}
