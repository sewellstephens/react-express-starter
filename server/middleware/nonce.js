
let session = {};

const generateNonce = () => {
    if (typeof session.nonce !== 'undefined') {
        return session.nonce;
    }

    const nonce = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    session.nonce = nonce;
    return nonce;
}       

export { generateNonce };
