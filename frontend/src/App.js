import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Mainnavigation from './component/navigation/Mainnavigation';
import Auth from './pages/Auth';
import Event from './pages/Event';
import Booking from './pages/Booking';
import AuthContext from './context/auth-context';

class App extends React.Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  }

  logout = () => {
    this.setState({ token: null, userId: null });
  }


  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{
          token: this.state.token,
          userId: this.state.userId,
          login: this.login,
          logout: this.logout
        }}>
          <Mainnavigation />
          <main className="main_content">
            <Switch>
              <div className="App">
                {!this.state.token && <Redirect to="/auth" exact />}
                {this.state.token && <Redirect to="/event" exact />}
                {this.state.token && <Redirect from="/booking" to="/auth" exact />}
                {this.state.token && <Redirect from="/auth" to="/event" exact />}
                {!this.state.token && <Route path="/auth" component={Auth} />}
                <Route path="/event" component={Event} />
                {this.state.token && <Route path="/booking" component={Booking} />}
              </div>
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );

  }
}

export default App;
