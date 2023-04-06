import React, { memo, useReducer, useEffect } from "react";

import { Container, Row, Col, Button } from "reactstrap";

import { SET_SCORE, IS_DEUCE, SET_WINNER, RESTART } from "./actions";
import reducer from "./reducer";

import "./App.scss";
import "./Court.scss";

const players = ["Roger", "Tim"];

const scoring = [0, 15, 30, 40, 45, "A"];
const advantageScore = scoring[scoring.length - 1];
const winnerScore = scoring[scoring.length - 2];
const deuceScore = scoring[scoring.length - 3];

const initialState = {
  [players[0]]: scoring[0],
  [players[1]]: scoring[0],
  isDeuce: false,
  winner: null,
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    if (state[scoringPlayer] === advantageScore)
      // Scoring player wins.
      newState = {
        [scoringPlayer]: winnerScore,
      };
    // Scoring player is on deuce score and other player is on advantage.
    else if (
      state[scoringPlayer] === deuceScore &&
      state[otherPlayer] === advantageScore
    )
      // Other player goes back to deuce score.
      newState = {
        [otherPlayer]: deuceScore,
      };
    else {
      // Scoring player goes on advantage.
      newState = {
        [scoringPlayer]: advantageScore,
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

  const Player = ({ name, id, handleClick }) => {
    return (
      <Col sm={6}>
        <h3>{name}</h3>
        {!state.winner && (
          <Button data-testid={`score-button-${id}`} onClick={handleClick}>
            Score
          </Button>
        )}
      </Col>
    );
  };

  const PlayerOne = () => {
    const name = `${players[0]} - ${state[players[0]]}`;
    return <Player name={name} id="p1" handleClick={scorePlayerOne} />;
  };
  const PlayerTwo = () => {
    const name = `${players[1]} - ${state[players[1]]}`;
    return <Player name={name} id="p2" handleClick={scorePlayerTwo} />;
  };

  const Deuce = memo(() => (
    <Col xs={12}>
      <h5>Deuce</h5>
    </Col>
  ));

  const Winner = memo(() => (
    <Col xs={12}>
      <h5>{state.winner} wins</h5>
      <Button onClick={restart}>New Game</Button>
    </Col>
  ));

  const Court = memo(() => (
    <div className="court" data-testid={`court`}>
      <div className="court__grid">
        <div className="court__cell court__alley--top-left" />
        <div className="court__cell court__alley--top-right" />
        <div className="court__cell court__nml--left" />
        <div className="court__cell court__ad--left" />
        <div className="court__cell court__ad--right" />
        <div className="court__cell court__dc--left" />
        <div className="court__cell court__dc--right" />
        <div className="court__cell court__nml--right" />
        <div className="court__cell court__alley--bottom-left" />
        <div className="court__cell court__alley--bottom-right" />
      </div>
    </div>
  ));

  return (
    <Container align="center">
      <Row>
        <Court />
      </Row>
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
