// store/actions.js
export const saveToken = ({ commit }, token) => {
    localStorage.setItem('token', token);
    commit('SET_TOKEN', token);
};

export const removeToken = ({ commit }) => {
    localStorage.removeItem('token');
    commit('SET_TOKEN', '');
};
