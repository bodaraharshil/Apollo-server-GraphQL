import React from 'react';
import "./auth.css";
import AuthContext from '../context/auth-context';

class Authpage extends React.Component {

    static contextType = AuthContext;
    state = {
        isLogin: ""
    }


    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModelHandler = async () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin }
        })
    }

    submitHandler = async (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        let requestBody = "";
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation($email:String!,$password:String!) {
                        createUser(userInput:{email:$email,password:$password}) {
                            _id
                            email
                            password
                        }
                    }
                `,
                variables: { password, email }
            };
        }
        else {
            requestBody = {
                query: `
                        query($email:String!,$password:String!) {
                            login(email:$email,password:$password) {
                                userId
                                token
                                tokenExpiration
                            }
                        }
                    `,
                variables: { password, email }
            };
        }


        await fetch(`${process.env.REACT_APP_NODE_API}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed!");
            }
            return res.json();
        }).then((resData) => {
            if (resData.data.login.token) {
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration)
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" name="email" placeholder="E-mail" ref={this.emailEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">password</label>
                    <input type="password" name="password" placeholder="Password" ref={this.passwordEl} />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-grad">Submit</button>
                    <button type="button" className="btn-grad" onClick={this.switchModelHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                </div>
            </form>
        )
    }
}

export default Authpage;