import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

import useRaf from "../hooks/useRaf";
import { useStore } from "../Store";
import ViewBase, { SpaceGrow, ButtonGroup } from "./ViewBase";
import AppBar from "./AppBar";
import Task from "./Task";

function StartedSince() {
  let [state] = useStore();
  let [duration, setDuration] = useState(state.process.startTimestamp);
  let [time, setTime] = useState(state.process.startTimestamp);

  useRaf(() => {
    let datetime = moment(state.process.startTimestamp);
    setDuration(datetime.fromNow());
    setTime(datetime.format("LLL"));
  });

  return `${duration} (${time})`;
}

export default function ProcessRun() {
  let [state, dispatch] = useStore(true);

  const running = state.process.running;

  return (
    <>
      <AppBar
        title={
          running ? (
            <>
              Started <StartedSince />
            </>
          ) : (
            "Check Process"
          )
        }
      >
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              dispatch({ type: "START_PROCESS", timestamp: Date.now() })
            }
            disabled={running}
          >
            Start process
          </Button>
          {running ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                dispatch({ type: "ABORT_PROCESS", timestamp: Date.now() })
              }
            >
              Abort
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => dispatch({ type: "CANCEL_PROCESS" })}
            >
              Back
            </Button>
          )}
        </ButtonGroup>
      </AppBar>
      <ViewBase>
        {state.todos.map((todo, index) => {
          return (
            <Task
              key={index}
              index={index}
              value={todo.value}
              selected={state.process.currentIndex === index}
            />
          );
        })}
      </ViewBase>
    </>
  );
}
