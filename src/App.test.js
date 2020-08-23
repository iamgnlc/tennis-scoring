import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";

it("renders players name", () => {
  const { getByText } = render(<App />);
  expect(getByText(/Roger/)).toBeInTheDocument();
  expect(getByText(/Tim/)).toBeInTheDocument();
});

test("player 1 score", async () => {
  const { getByTestId, findByText } = render(<App />);

  fireEvent.click(getByTestId("score-button-p1"));

  const playerOne = await findByText(/Roger - 15/);
  expect(playerOne).toBeInTheDocument();
});

test("player 1 wins", async () => {
  const { getByTestId, findByText } = render(<App />);

  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));

  const playerOne = await findByText(/Roger wins/);
  expect(playerOne).toBeInTheDocument();
});

test("match on deuce", async () => {
  const { getByTestId, findByText } = render(<App />);

  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));

  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));

  const playerOne = await findByText(/Roger - 40/);
  const playerTwo = await findByText(/Tim - 40/);
  const deuce = await findByText(/Deuce/);
  expect(playerOne).toBeInTheDocument();
  expect(playerTwo).toBeInTheDocument();
  expect(deuce).toBeInTheDocument();
});

test("player 1 on advantage", async () => {
  const { getByTestId, findByText } = render(<App />);

  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));

  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));

  fireEvent.click(getByTestId("score-button-p1"));

  const playerOne = await findByText(/Roger - A/);
  expect(playerOne).toBeInTheDocument();
});

test("player 1 on advantage than back on deuce point", async () => {
  const { getByTestId, findByText } = render(<App />);

  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));

  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));

  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p2"));

  const playerOne = await findByText(/Roger - 40/);
  expect(playerOne).toBeInTheDocument();
});

test("player 1 on advantage but player 2 wins", async () => {
  const { getByTestId, findByText } = render(<App />);

  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));
  fireEvent.click(getByTestId("score-button-p1"));

  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));

  fireEvent.click(getByTestId("score-button-p1"));

  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));
  fireEvent.click(getByTestId("score-button-p2"));

  const playerOne = await findByText(/Tim wins/);
  expect(playerOne).toBeInTheDocument();
});
