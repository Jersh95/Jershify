import { Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

export const Login = (props) => {
    
    const authorizeUrl = 'https://accounts.spotify.com/authorize';

    return (
        <Button id="LoginButton" className="btn btn-primary" onClick={() => {
            let url = authorizeUrl;
            url += '?client_id=' + clientId;
            url += '&response_type=code';
            url += '&redirect_uri=' + encodeURI(redirectUri);
            url += '&show_dialog=true';
            url += '&scope=user-read-private user-read-email user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private'

            window.location.href = url;
        }}>Log in with Spotify</Button>
    )

};