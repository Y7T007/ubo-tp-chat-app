import './App.css';
import { Login } from "./user/login/Login";
import AppRouter from "./routes/router";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

function App() {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "cbb93ff3-7b76-4414-9c3c-9a8b2d20902b",
  });
  const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
    url: "/api/beams",
    headers: {
      Authentication: "Bearer " + sessionStorage.getItem("token"),
    },
  });

  beamsClient
      .start()
      .then((beamsClient) => beamsClient.getDeviceId())
      .then((deviceId) =>
          console.log("Successfully registered with Beams. Device ID:", deviceId)
      )
      .then(() => beamsClient.addDeviceInterest(sessionStorage.getItem("externalId")))
      .then(() => beamsClient.getDeviceInterests())
      .then((interests) => console.log("Current interests:", interests))
      .catch(console.error);

  return (
      <AppRouter />
  );
}

export default App;



