import { createAsyncAction, errorResult, Store, successResult } from "pullstate";
import { MessageStore } from "./MessageStore";

export const UserStore = new Store({
    user: {
        loggedIn: false,
        displayName: '',
        email: '',
        href: '',
        uri: '',
        id: '',
        images: []
    }
});

export const getUser = createAsyncAction(async ({ accessToken }) => {
    return await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    })
        .then((response) => {
            return response.json()
                .then((response) => {
                    if (response.error) {
                        return errorResult({}, 'An error occurred while retrieving Spotify user details.', {});
                    } else {
                        return successResult(response, {}, "Successfully retrieved Spotify user details.");
                    }
                })
                .catch(() => errorResult({}, 'An error occurred while retrieving Spotify user details.', {}));
        });
}, {
    postActionHook: ({ result }) => {
        if (!result.error) {
            UserStore.update(state => {
                state.user.loggedIn = true;
                state.user.displayName = result.payload.display_name;
                state.user.email = result.payload.email;
                state.user.href = result.payload.href;
                state.user.uri = result.payload.uri;
                state.user.images = result.payload.images;
                state.user.id = result.payload.id;
            });
            MessageStore.update(state => {
                state.messages.push({
                    message: 'Success retrieving user.',
                    variant: 'success',
                    dismissable: true
                });
            });
        } else {
            MessageStore.update(state => {
                state.messages.push({
                    message: 'Error retrieving user.',
                    variant: 'danger',
                    dismissable: true
                });
            });
        }
    }
});

