import React, { Component } from 'react';
import axios from 'axios';
import Sentiment from 'sentiment';

import NewMessage from './NewMessage.jsx';
import Message from './Message.jsx';
import Title from './Title.jsx';

export default class Chat extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: 'bob',
      userId: 1337,
      activeRoom: 'lobby',
      activeRoomId: 1,
      rooms: ['lobby', 'theOtherRoom'],
      roomScore: 0,
      messages: [],
      newMessageText: '',
      messageScore: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.refreshInput = this.refreshInput.bind(this);
  }
  tick() {
    this.getMessages();
  }

  componentDidMount = () => {
    this.getMessages();
    this.interval = setInterval(() => this.tick(), 1000);
  }

  getMessages = () => {
    axios.get('/messages')
      .then(res => { // Checks each message from server against activeRoomId
        // and filters out the ones that don't match, messages for the active
        // room are stored in state.messages
        const msgs = res.data.reverse().filter(msg => {
          return (msg.roomId === this.state.activeRoomId);
        });
        this.setState({
          messages: msgs
        });
        console.log(this.state.messages);
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
    console.log(this.state.newMessageText);
    axios.post('/messages', {
      roomId: this.state.roomId,
      userId: this.state.userId,
      text: this.state.newMessageText,
      score: this.state.messageScore
    })
      .then(res => {
        console.log('new message POSTed to /messages');
        this.refreshInput();
        this.getMessages();
      })
      .catch(err => {console.error(err)});
  }

  changeRoom = (event) => {
    this.setState({
      activeRoom: event.target.value
    });
    console.log('leaving ' + this.state.activeRoom);
  }

  componentWillMount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Title user={this.state.user} room={this.state.activeRoom} score={this.state.roomScore} rooms={this.state.rooms} changeRoom={this.changeRoom}/>
        <div className="chat">
          <ul>
            {this.state.messages.map((message, index, arr) => 
              <Message key={index} messageData={message} />
            )}
          </ul>
          <NewMessage text={this.state.newMessageText} handleChange={this.handleChange} postMessage={this.postMessage} refresh={this.refresh}/>
        </div>
      </div>
    )
  }
}
