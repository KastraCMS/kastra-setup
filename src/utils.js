export const getXSRFToken = () => {
    const element = document.getElementById('RequestVerificationToken');

    return element && element.value;
}

export const checkError = (response) => {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
}