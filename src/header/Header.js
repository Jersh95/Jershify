import React, { useEffect, useState } from 'react';
import { addMessage, MessageStore } from '../state-stores/MessageStore';
import { UserStore, getUser } from '../state-stores/UserStore';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import Avatar from 'boring-avatars';

export const Header = (props) => {

    

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const user = UserStore.useState(state => state.user);
    const messages = MessageStore.useState(state => state.messages);

    useEffect(() => {
        if (window.location.search.length > 0) {
            handleRedirect();
        } else {
            setAccessToken(localStorage.getItem("access_token"));
            if (accessToken == null) {
                //Make them re-login?
            } else {
                //They are logged in, show them stuff
            }
        }
    }, []);

    const handleRedirect = () => {
        let code = getCode();
        fetchAccessToken(code);
        window.history.pushState("", "", redirectUri); // remove param from url
    }

    const fetchAccessToken = (code) => {
        let body = 'grant_type=authorization_code';
        body += '&code=' + code;
        body += '&redirect_uri=' + encodeURI(redirectUri);
        body += '&client_id=' + clientId;
        body += '&client_secret=' + clientSecret;
        callAuthorizationApi(body);
    }

    const callAuthorizationApi = async (body) => {
        await fetch(tokenUrl, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            }
        })
            .then(response => response.json())
            .then((response) => {
                handleAuthorizationResponse(response)
            })
            .catch(() => {
                // handle error via a global dropin?
            })
    }

    const handleAuthorizationResponse = async (response) => {
        if (response) {
            setAccessToken(response.access_token);
            localStorage.setItem("access_token", response.access_token);
            setRefreshToken(response.refresh_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            getUser.run({ accessToken: response.access_token });
        }
        else {
            // console.log(this.responseText);
            // alert(this.responseText);
        }
    }

    const getCode = () => {
        let code = null;
        const queryString = window.location.search;
        if (queryString.length > 0) {
            const urlParams = new URLSearchParams(queryString);
            code = urlParams.get('code');
        }
        return code;
    }


    return (
        <header className="AppHeader p-2">
            <Row>
                <Col>
                    {user && user.loggedIn &&
                        <React.Fragment>
                            {user.images && user.images.length > 0 &&
                                <React.Fragment>
                                    <Image roundedCircle src={user.images[0].url} height='50px' width='50px' />
                                    <span>{user.displayName}</span>
                                </React.Fragment>
                            }
                        </React.Fragment>
                    }
                </Col>
            </Row>
            
        </header>
    )

};