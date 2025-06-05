import { Container, Step } from "semantic-ui-react";

function CallProgress() {
  const placeholderCall = {
    CallSid: "CA123456789",
    CallStatus: "answered",
  };

  return (
    <Container>
      <Step.Group fluid>
        <Step
          icon="phone"
          title="Ringing"
          description={placeholderCall.CallSid}
          active={placeholderCall.CallStatus === "ringing"}
          completed={placeholderCall.CallStatus !== "ringing"}
        />
        <Step
          icon="cogs"
          title="In queue"
          description="User waiting in queue"
          active={placeholderCall.CallStatus === "enqueue"}
          disabled={placeholderCall.CallStatus === "ringing"}
          onClick={() => console.log("Answer call:", placeholderCall.CallSid)}
        />
        <Step
          icon="headphones"
          title="Answered"
          description="Answer by John"
          disabled={
            placeholderCall.CallStatus === "ringing" ||
            placeholderCall.CallStatus === "enqueue"
          }
        />
        <Step
          icon="times"
          title="Hang up"
          description="Missed call"
          disabled={
            placeholderCall.CallStatus === "ringing" ||
            placeholderCall.CallStatus === "enqueue" ||
            placeholderCall.CallStatus === "answered"
          }
        />
      </Step.Group>
    </Container>
  );
}

export default CallProgress;