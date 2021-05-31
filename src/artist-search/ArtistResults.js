import { useStoreState } from 'pullstate';
import React, { useEffect, useState } from 'react';
import { Card, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { LibraryStore } from '../state-stores/LibraryStore';
import { ArtistModal } from './ArtistModal';

export const ArtistResults = (props) => {
    const { library, loading } = LibraryStore.useState(state => ({
        library: state.library,
        loading: state.loading
    }));
    const [selectedArtist, setSelectedArtist] = useState(undefined);

    return (
        <Row>
            {loading ? (
                <Spinner className='m-auto' animation='border' role='status'>
                    <span className='sr-only'>Generating library...</span>
                </Spinner>
            ) : (
                <React.Fragment>
                    <ArtistModal artist={selectedArtist} />

                    {library && library.entries && [...library.values()].map((artist, index) => {
                        return (
                            <Col xs={3} sm={4} key={index}>
                                <Card>
                                    <Card.Body onClick={() => setSelectedArtist(artist)}>
                                        <Card.Title className='d-flex'>
                                            <Col xs={9}>
                                                <span>{artist.name}</span>
                                            </Col>
                                            <Col xs={3}>
                                                <span>({artist.tracks.length})</span>
                                            </Col>
                                        </Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </React.Fragment>

            )}
        </Row>
    )
}