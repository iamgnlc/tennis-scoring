import { SET_SCORE, RESTART, SET_WINNER, IS_DEUCE } from "./actions";

export default (state, action) => {
  switch (action.type) {
    case RESTART:
      return {
        ...action.state,
      };
    case SET_SCORE:
      return {
        ...state,
        ...action.state,
      };
    case IS_DEUCE:
      return {
        ...state,
        isDeuce: action.isDeuce,
      };
    case SET_WINNER:
      return {
        ...state,
        winner: action.winner,
      };
    default:
      return false;
  }
};
