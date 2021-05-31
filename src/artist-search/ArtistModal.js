import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { generatePlaylist } from '../state-stores/LibraryStore';
import { UserStore } from '../state-stores/UserStore';

export const ArtistModal = (props) => {

    const { artist } = props;
    useEffect(() => {
        setShow(typeof artist !== 'undefined')
    }, [artist])

    const [show, setShow] = useState(false);
    const {user}  = UserStore.useState(state => ({
        user: state.user
    }))

    const accessToken = localStorage.getItem('access_token');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <React.Fragment>
            { artist &&
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{artist.name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Button onClick={() => generatePlaylist.run({accessToken: accessToken, userId: user.id, artist: artist})}>Generate Playlist</Button>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            }
        </React.Fragment>

    )

}