import NavBar from "./NavBar";
import CallProgress from "./CallProgress";

function CallCenter({ calls }) {
  console.log("calls: ", calls);
  return (
    <div>
      <NavBar />
      {calls.calls.map((call) => (
        <CallProgress key={call.data.callSid} call={call.data} />
      ))}
    </div>
  );
}

export default CallCenter;