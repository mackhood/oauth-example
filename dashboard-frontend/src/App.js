import "./App.css";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import Challenges from "./Challenges";
import { Route, Switch, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const history = useHistory();

  console.log("🔍 isAuthenticated:", isAuthenticated);
  console.log("🔄 Auth0 Loading:", isLoading);
  console.log("👤 User:", user); // ✅ Log user object

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      history.push("/challenges");
    }
  }, [isAuthenticated, isLoading, history]);

  if (isLoading) {
    return <h3>Loading authentication...</h3>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard</h1>
      </header>
      <div className="App-body">
        <span>
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </span>

        <Switch>
          <Route path="/challenges" component={Challenges} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
