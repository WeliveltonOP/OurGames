import { createReducer } from 'redux-act';
import * as a from '../actions/game';

const getDefaultState = (_) => ({
  favoriteUpdate: null,
});

export default (_) =>
  createReducer(
    {
      [a.setGameOptions]: (state, { favoriteUpdate }) => ({
        ...state,
        favoriteUpdate,
      }),
    },
    getDefaultState()
  );
