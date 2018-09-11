import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
} from 'react-native';

import SocketIOClient  from 'socket.io-client';

export default class App extends Component {
  state={
    messages: [],
    message: ''
  }

  constructor(props) {
    super(props)
    this.socket = SocketIOClient ('https://track-backend.now.sh');
    this.socket.on('id', (id) => {
      this.setState({ id })
    })

    this.socket.on('message', (payload) => {
      console.log(payload)
      this.setState({
        messages: this.state.messages.concat(payload)
      })
    })
  }

  texting = (message) => {
    this.setState({message})
  }

  sendMessage = () => {
    this.socket.emit('message', this.state.message)
    this.setState({ message: '' })
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Simple message
        </Text>
        
          <FlatList 
            data = {this.state.messages}
            renderItem = { ({item}) => 
              <View style={ this.state.id == item.id ? styles.meMessageWrapper:styles.messageWrapper}>
                <Text style={ this.state.id == item.id ? styles.meMessage:styles.message}> {item.msg} </Text>
              </View> 
              }
            ListEmptyComponent = { <Text> no hay mensajes </Text> }
          />
          <TextInput 
            onChangeText={this.texting} 
            onSubmitEditing={this.sendMessage} 
            value={this.state.message}
          />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  messageWrapper:{
    marginBottom: 4,
    flexDirection:'row',
  },
  message:{
    flexWrap: 'wrap', 
    padding: 2, 
    backgroundColor: '#009688',
    fontSize: 20,
    color: '#fff'
  },
  meMessageWrapper:{
    marginBottom: 4,
    flexDirection:'row',
    alignItems: 'flex-end'
  },
  meMessage:{
    flexWrap: 'wrap', 
    padding: 2, 
    backgroundColor: '#607d8b',
    fontSize: 20,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
