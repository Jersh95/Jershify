import { createAsyncAction, errorResult, Store, successResult } from "pullstate";
import  {generateLibrary, handleCreateRequest } from '../artist-search/ArtistSearchService';

export const LibraryStore = new Store({
    searchString: '',
    library: {},
    loading: false
});

export const getLibrary = createAsyncAction(async ({ accessToken }) => {
    LibraryStore.update(state => {
        state.loading = true;
    });
    return await generateLibrary(accessToken)
    .then(library => {
        return successResult(library, {}, 'Successfully generated library.');
    })
    .catch(() => errorResult({}, 'An error occurred while generating library.'))
}, {
    postActionHook: ({ result }) => {
        LibraryStore.update(state => {
            state.library = result.payload;
            state.loading = false;
        })
    }
});

export const generatePlaylist = createAsyncAction(async ({ accessToken, userId, artist }) => {
    LibraryStore.update(state => {
        state.loading = true;
    });
    console.log('okgogo')
    return await handleCreateRequest(accessToken, userId, artist)
    .then(library => {
        return successResult(library, {}, 'Successfully generated library.');
    })
    .catch(() => errorResult({}, 'An error occurred while generating library.'))
}, {
    postActionHook: ({ result }) => {
        console.log('result', result)
        LibraryStore.update(state => {
            state.library = result.payload;
            state.loading = false;
        })
    }
});