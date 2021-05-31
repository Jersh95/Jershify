import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { getUser, UserStore } from './state-stores/UserStore';
import { Header } from './header/Header';
import { MessageStore } from './state-stores/MessageStore';
import { Container } from 'react-bootstrap';
import { Login } from './login/Login';
import { ArtistSearch } from './artist-search/ArtistSearch';


const App = (props) => {

  const user = UserStore.useState(state => state.user);
  const messages = MessageStore.useState(state => state.messages);

  return (
    <Container fluid className="App">
      <Header />
      <Container fluid id='AppContent'>

      {user && user.loggedIn ? (
        <React.Fragment>
          <ArtistSearch/>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Login/>
        </React.Fragment>
      )}
      </Container>
    </Container>
  );
}

export default App;
