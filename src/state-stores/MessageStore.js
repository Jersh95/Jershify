import { Store } from "pullstate";

export const MessageStore = new Store({
    messages: [
    // {
    // message: '',
    // variant: '',
    // linkHref: '',
    // linkText: '',
    // onClose: undefined,
    // dismissable: false
    // }
    ]
});

export const addMessage = (message) => {
    if(message) {
        MessageStore.update(state => {
            state.messages.push({...message});
        });
    }
}