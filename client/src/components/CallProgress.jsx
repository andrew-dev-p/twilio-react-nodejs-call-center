import { Container, Step } from "semantic-ui-react";

function CallProgress({ call }) {
  return (
    <Container>
      <Step.Group fluid>
        <Step
          icon="phone"
          title="Ringing"
          description={call.CallSid}
          active={call.CallStatus === "ringing"}
          completed={call.CallStatus !== "ringing"}
        />
        <Step
          icon="cogs"
          title="In queue"
          description="User waiting in queue"
          active={call.CallStatus === "enqueue"}
          disabled={call.CallStatus === "ringing"}
          onClick={() => console.log("Answer call:", call.CallSid)}
        />
        <Step
          icon="headphones"
          title="Answered"
          description="Answer by John"
          disabled={
            call.CallStatus === "ringing" ||
            call.CallStatus === "enqueue"
          }
        />
        <Step
          icon="times"
          title="Hang up"
          description="Missed call"
          disabled={
            call.CallStatus === "ringing" ||
            call.CallStatus === "enqueue" ||
            call.CallStatus === "answered"
          }
        />
      </Step.Group>
    </Container>
  );
}

export default CallProgress;