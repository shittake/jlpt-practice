import { LoginPage } from "./Views/LoginPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { EntryPage } from "./Views/EntryPage";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(window.sessionStorage.getItem("isLoggedIn") === "true");
  }, []);
  console.log(isLoggedIn);
  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginPage setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <EntryPage />
      )}
    </div>
  );
}

export default App;
