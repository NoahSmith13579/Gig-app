interface jwtData {
    sub: string;
    name: string;
    email: string;
}

/**
 * Takes a token from the backend, decodes it to expose the payload
 */
const decodeJwt = (token: string) => {
    const splittoken = token.split('.');
    if (splittoken.length !== 3) {
        throw 'Invalid token';
    }

    const payload = splittoken[1];

    const decoded = atob(payload); //base64 decode.
    const parsed = JSON.parse(decoded) as jwtData;

    if (!parsed || !parsed.sub || !parsed.name || !parsed.email) {
        throw 'Invalid token data';
    }

    return parsed;
};
export { decodeJwt };
