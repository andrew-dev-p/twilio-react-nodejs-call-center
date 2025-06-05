import React from "react";
import { Grid, Header, Segment, Form, Button } from "semantic-ui-react";

function Login({
  user: { username, mobileNumber, verificationCode, verificationSent },
  setUser,
  sendSmsCode,
  sendVerificationCode,
}: {
  user: {
    username: string;
    mobileNumber: string;
    verificationCode: string;
    verificationSent: boolean;
  };
  setUser: (
    user:
      | {
          username: string;
          mobileNumber: string;
          verificationCode: string;
          verificationSent: boolean;
        }
      | ((prevUser: {
          username: string;
          mobileNumber: string;
          verificationCode: string;
          verificationSent: boolean;
        }) => {
          username: string;
          mobileNumber: string;
          verificationCode: string;
          verificationSent: boolean;
        })
  ) => void;
  sendSmsCode: () => void;
  sendVerificationCode: () => void;
}) {
  function populateFilds(
    event: React.ChangeEvent<HTMLInputElement>,
    data: { name?: string; value: string }
  ) {
    if (!data.name) return;
    setUser((prevUser) => ({
      ...prevUser,
      [data.name]: data.value,
    }));
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ height: "100vh" }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Login into your account:
        </Header>
        <Form>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="UserName"
              value={username}
              onChange={(event, data) => populateFilds(event, data)}
              name="username"
            />
            <Form.Input
              fluid
              icon="mobile alternate"
              iconPosition="left"
              placeholder="Mobile number"
              value={mobileNumber}
              onChange={(event, data) => populateFilds(event, data)}
              name="mobileNumber"
            />
            {verificationSent && (
              <Form.Input
                fluid
                icon="key"
                iconPosition="left"
                placeholder="Enter your code"
                value={verificationCode}
                onChange={(event, data) => populateFilds(event, data)}
                name="verificationCode"
              />
            )}
            <Button
              color="teal"
              fluid
              size="large"
              onClick={!verificationSent ? sendSmsCode : sendVerificationCode}
            >
              {!verificationSent ? "Login/Signup" : "Enter your Code"}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
