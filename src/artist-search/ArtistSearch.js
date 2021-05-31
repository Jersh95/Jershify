import React, { useEffect, useState } from 'react';
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { getLibrary, LibraryStore } from '../state-stores/LibraryStore';
import { ArtistResults } from './ArtistResults';

export const ArtistSearch = (props) => {

    const accessToken = localStorage.getItem('access_token');
    const { library, loading } = LibraryStore.useState(state => ({
        library: state.library,
        loading: state.loading
    }));

    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <InputGroup className='mb-3'>
                        <FormControl placeholder='Search liked artists...' aria-label='Search liked artists' />
                        <Button onClick={(() => getLibrary.run({ accessToken: accessToken }))}>Search</Button>
                    </InputGroup>
                </Col>
            </Row>
            <ArtistResults />
        </React.Fragment>
    )

}