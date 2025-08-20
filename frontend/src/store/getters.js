// store/getters.js
export const getToken = (state) => state.token;
export const isLogged = (state) => !!state.token; // Returns true if token exists

