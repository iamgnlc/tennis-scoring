import React, { useReducer, useEffect } from "react";

import { Container, Row, Col, Button } from "reactstrap";

import { SET_SCORE, IS_DEUCE, SET_WINNER, RESTART } from "./actions.js";
import reducer from "./reducer.js";

import "./App.scss";

const players = ["Roger", "Tim"];

const scoring = [0, 15, 30, 40, 45];

const initialState = {
  [players[0]]: scoring[0],
  [players[1]]: scoring[0],
  isDeuce: false,
  winner: null,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const winnerScore = scoring[scoring.length - 1];
  const deuceScore = scoring[scoring.length - 2];

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

    // Scoring player is already on advantage.
    if (state[scoringPlayer] === "A")
      // Scoring player wins.
      newState = {
        [scoringPlayer]: winnerScore,
      };
    // Scoring player is on deuce score and other player is on advantage.
    else if (state[scoringPlayer] === deuceScore && state[otherPlayer] === "A")
      // Other player goes back to deuce score.
      newState = {
        [otherPlayer]: deuceScore,
      };
    else {
      // Scoring player goes on advantage.
      newState = {
        [scoringPlayer]: "A",
      };
    }

    return newState;
  };

  const setScore = (index) => {
    let newState;

    // If match is on deuce workout advantage, otherwise set normal score.
    if (state.isDeuce) newState = setAdvantage(index);
    else {
      newState = setPoint(index);
    }

    dispatch({
      type: SET_SCORE,
      state: newState,
    });
  };

  const scorePlayerOne = () => setScore(0);

  const scorePlayerTwo = () => setScore(1);

  const setDeuce = () => {
    // If both playes are on deuce score, match goes on deuce.
    if (state[players[0]] === deuceScore && state[players[1]] === deuceScore) {
      const newState = {
        type: IS_DEUCE,
        isDeuce: true,
      };

      dispatch(newState);
    }
  };

  const setWinner = () => {
    players.forEach((player) => {
      if (state[player] === winnerScore) {
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

  const PlayerOne = () => (
    <Col sm={6}>
      <h3>
        {[players[0]]} - {state[players[0]]}
      </h3>
      {!state.winner && (
        <Button data-testid="score-button-p1" onClick={scorePlayerOne}>
          Score
        </Button>
      )}
    </Col>
  );

  const PlayerTwo = () => (
    <Col sm={6}>
      <h3>
        {[players[1]]} - {state[players[1]]}
      </h3>
      {!state.winner && (
        <Button data-testid="score-button-p2" onClick={scorePlayerTwo}>
          Score
        </Button>
      )}
    </Col>
  );

  const Deuce = () => (
    <Col xs={12}>
      <h5>Deuce</h5>
    </Col>
  );

  const Winner = () => (
    <Col xs={12}>
      <h5>{state.winner} wins</h5>
      <Button onClick={restart}>New Game</Button>
    </Col>
  );

  return (
    <Container align="center">
      <Row>
        <PlayerOne />
        <PlayerTwo />
        {!state.winner && state.isDeuce && <Deuce />}
        {state.winner && <Winner />}
      </Row>
    </Container>
  );
};

export default App;
