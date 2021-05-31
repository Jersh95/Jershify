import { errorResult, successResult } from "pullstate";

const limit = 50;

export const generateLibrary = async (accessToken) => {
    let page = 1;
    let shouldSearch = true;
    let artists = new Map();

    do {
        await searchLibraryPage(accessToken, page)
            .then(response => {
                response.payload.items.forEach(item => {
                    item.track.artists.forEach(artist => {
                        if (artists.has(artist.name)) {
                            artists.get(artist.name).tracks.push({
                                album: {
                                    name: item.track.album.name,
                                    releaseDate: item.track.album.release_date,
                                    href: item.track.album.href,
                                    uri: item.track.album.uri,
                                    images: item.track.album.images
                                },
                                durationMS: item.track.duration_ms,
                                href: item.track.href,
                                uri: item.track.uri,
                                id: item.track.id,
                                name: item.track.name,
                                popularity: item.track.popularity,
                                previewUrl: item.track.previewUrl
                            });
                        } else {
                            artists.set(artist.name, {
                                name: artist.name,
                                href: artist.href,
                                uri: artist.uri,
                                tracks: [{
                                    album: {
                                        name: item.track.album.name,
                                        releaseDate: item.track.album.release_date,
                                        href: item.track.album.href,
                                        uri: item.track.album.uri,
                                        images: item.track.album.images
                                    },
                                    durationMS: item.track.duration_ms,
                                    href: item.track.href,
                                    uri: item.track.uri,
                                    id: item.track.id,
                                    name: item.track.name,
                                    popularity: item.track.popularity,
                                    previewUrl: item.track.previewUrl
                                }]
                            })
                        }
                    })
                });
                page++;
                shouldSearch = (response.payload.total > (limit * page));

            });
    } while (shouldSearch);

    const sortedArtists = new Map([...artists.entries()].sort())
    return sortedArtists;
};

export const searchLibraryPage = async (accessToken, page) => {

    return await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${(page - 1) * limit}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    })
        .then(response => response.json())
        .then(response => {
            if (!response.error) {
                return successResult(response, {}, `Successfully retrieved Spotify library tracks page ${page}.`);
            } else {
                return errorResult({}, "An error occurred while searching Spotify library tracks.", {})
            }
        });
};

export const searchPlaylistsPage = async (accessToken, userId, page) => {
    return await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}&offset=${(page - 1) * limit}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    })
        .then(response => response.json())
        .then(response => {
            if (!response.error) {
                return successResult(response, {}, `Successfully retrieved Spotify playlists page ${page}.`);
            } else {
                return errorResult({}, "An error occurred while searching Spotify playlists.", {})
            }
        });
};

export const createPlaylist = async (accessToken, userId, artist) => {
    const data = {
        name: `Jershify - ${artist.name}`,
        public: false,
        description: 'Auto generated playlist from Jershify.'
    };
    return await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if (!response.error) {
                    return successResult(response, {}, `Successfully created Spotify playlists Jershify - ${artist.name}.`);
                } else {
                    return errorResult({}, "An error occurred while creating Spotify playlists.", {})
                }
            });
}

export const handleCreateRequest = async (accessToken, userId, artist) => {
    let page = 1;
    let shouldSearch = true;
    let filteredPlaylist = undefined;

    do {
        await searchPlaylistsPage(accessToken, userId, 1)
            .then(response => {
                filteredPlaylist = response.payload.items.filter(playlist => playlist.name === `Jershify - ${artist.name}`)[0];
                page++;
                shouldSearch = (!filteredPlaylist && response.payload.total > (limit * page));
            });
    } while (shouldSearch);
    console.log('filteredPlaylist', filteredPlaylist)

    if (!filteredPlaylist) {
        console.log('artist', artist)
        console.log('playlist does not exist - creating');
        const data = {
            name: `Jershify - ${artist.name}`,
            public: false,
            description: 'Auto generated playlist from Jershify.'
        }
        await createPlaylist(accessToken, userId, artist)
        .then((result) => addPlaylistTracks(accessToken, result.payload.id, artist.tracks));
    } else {

    }

    return successResult();
};

export const addPlaylistTracks = async (accessToken, playlistId, tracks) => {
    const uris = tracks.map(track => track.uri);
    const data = {uris: uris};
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        console.log('addresponse', response)
        if (!response.error) {
            return successResult(response, {}, `Successfully added ${tracks.length} tracks to Spotify playlists.`);
        } else {
            return errorResult({}, "An error occurred while adding tracks to Spotify playlist.", {})
        }
    });

    return successResult();
};