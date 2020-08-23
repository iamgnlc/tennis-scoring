import React, { useReducer, useEffect } from "react";

import { Container, Row, Col, Button } from "reactstrap";

import { SET_SCORE, IS_DEUCE, SET_WINNER, RESTART } from "./actions.js";
import reducer from "./reducer.js";

import "./App.scss";

const players = ["Roger", "Tim"];

const scoring = [0, 15, 30, 40, 45];
const advantage = "A";

const initialState = {
  [players[0]]: scoring[0],
  [players[1]]: scoring[0],
  isDeuce: false,
  winner: null,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const winnerPoint = scoring[scoring.length - 1];
  const deucePoint = scoring[scoring.length - 2];

  const restart = () => {
    const newState = {
      type: RESTART,
      state: { ...initialState },
    };

    dispatch(newState);
  };

  const setPoint = (index) => {
    return {
      [players[index]]: scoring[scoring.indexOf(state[players[index]]) + 1],
    };
  };

  const setAdvantage = (index) => {
    let newState;

    const scoringPlayer = players[index];
    const otherPlayer = players[Number(!index)];

    // Scoring player is already on advantage
    if (state[scoringPlayer] === advantage)
      // Scoring player wins.
      newState = {
        [scoringPlayer]: winnerPoint,
      };
    // Scoring player is on deuce point and other player is on advantage.
    else if (
      state[scoringPlayer] === deucePoint &&
      state[otherPlayer] === advantage
    )
      // Other player goes back to deuce point.
      newState = {
        [otherPlayer]: deucePoint,
      };
    else {
      // Scoring player goes on advantage.
      newState = {
        [scoringPlayer]: advantage,
      };
    }

    return newState;
  };

  const setScore = (index) => {
    let newState = {
      type: SET_SCORE,
      state: null,
    };

    // If match is on deuce work out advantage, otherwise set normal point.
    if (state.isDeuce) newState.state = setAdvantage(index);
    else {
      newState.state = setPoint(index);
    }

    dispatch(newState);
  };

  const setDeuce = () => {
    // If both playes are on deuce point, match goes on deuce.
    if (state[players[0]] === deucePoint && state[players[1]] === deucePoint) {
      const newState = {
        type: IS_DEUCE,
        isDeuce: true,
      };

      dispatch(newState);
    }
  };

  const setWinner = () => {
    players.forEach((player) => {
      if (state[player] === winnerPoint) {
        const newState = {
          type: SET_WINNER,
          winner: player,
        };

        dispatch(newState);
      }
    });
  };

  useEffect(() => {
    if (!state.isDeuce) setDeuce();
    if (!state.winner) setWinner();
  });

  return (
    <Container align="center">
      <Row>
        <Col sm={6}>
          <h3>
            {[players[0]]} - {state[players[0]]}
          </h3>
          {!state.winner && (
            <Button data-testid="score-button-p1" onClick={() => setScore(0)}>
              Score
            </Button>
          )}
        </Col>
        <Col sm={6}>
          <h3>
            {[players[1]]} - {state[players[1]]}
          </h3>
          {!state.winner && (
            <Button data-testid="score-button-p2" onClick={() => setScore(1)}>
              Score
            </Button>
          )}
        </Col>
        {!state.winner && state.isDeuce && (
          <Col xs={12}>
            <h5>Deuce</h5>
          </Col>
        )}
        {state.winner && (
          <Col xs={12}>
            <h5>{state.winner} wins</h5>
            <Button onClick={() => restart()} outline>
              New Game
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default App;
