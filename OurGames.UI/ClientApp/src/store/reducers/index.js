import { combineReducers } from 'redux';
import auth from './auth';
import { connectRouter } from 'connected-react-router';

const getNewReducer = history =>
  combineReducers({
    ...Object.entries({ auth }).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value()
      }),
      {}
    ),
    router: connectRouter(history)
  });

export default history => (state, action) => {
  const reducer = getNewReducer(history);

  return reducer(state, action);
};
