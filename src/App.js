import SDK from "casdoor-js-sdk";
import { useState } from "react";
import "./App.css";

const { shell, ipcRenderer } = window?.electron;

const serverUrl = "https://door.casdoor.com";
const appName = "app-casnode";
const organizationName = "casbin";
const redirectPath = "/callback";
const clientId = "014ae4bd048734ca2dea";
const clientSecret = "f26a4115725867b7bb7b668c81e1f8f7fae1544d";

const redirectUrl = "http://localhost:3000" + redirectPath;
const sdkConfig = {
  serverUrl,
  clientId,
  appName,
  organizationName,
  redirectPath,
};
const sdk = new SDK(sdkConfig);

function App() {
  const [userInfo, setUserInfo] = useState();

  async function startAuth() {
    shell.openExternal(sdk.getSigninUrl());
    const { code } = await ipcRenderer.invoke("waitCallback", redirectUrl);
    const userInfo = await ipcRenderer.invoke(
      "getUserInfo",
      clientId,
      clientSecret,
      code
    );
    ipcRenderer.invoke("focusWin");

    setUserInfo(userInfo);
  }

  return (
    <div className="App">
      {userInfo ? (
        `Username: ${userInfo.username}`
      ) : (
        <button onClick={startAuth}>Login with Casdoor</button>
      )}
    </div>
  );
}

export default App;
