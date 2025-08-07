// store/index.js
import { createStore } from 'vuex';
import state from '@/store/state';           // Correct way to import a default export
import * as actions from '@/store/actions';
import * as mutations from '@/store/mutations';
import * as getters from '@/store/getters';

const store = createStore({
    state,
    actions,
    mutations,
    getters,
});

export default store;
