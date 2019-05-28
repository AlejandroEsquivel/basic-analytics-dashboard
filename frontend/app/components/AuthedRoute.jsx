import React from 'react';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import localStorage from 'local-storage-fallback';

import LoginRoute from '~/app/views/Login.jsx';

import config from '~/app/config';

const firebaseApp = firebase.initializeApp(config.FIREBASE);
const googleProvider = new firebase.auth.GoogleAuthProvider();
const firebaseAuth = firebaseApp.auth();

googleProvider.addScope('https://www.googleapis.com/auth/analytics.readonly');


class AuthRouter extends React.Component {

    render() {
        const { Route, ...props } = this.props;
        const { user } = props;

        const TOKEN_TYPE = 'token';

        props.firebaseAuth = firebaseAuth;
        props.googleProvider = googleProvider;

        props.auth = {
            signIn: ()=> firebaseAuth.signInWithPopup(googleProvider).then(function(result) {
                const token = result.credential.accessToken;
                localStorage.setItem(TOKEN_TYPE,token);
            }),
            signOut: () => this.props.signOut().then(()=>localStorage.removeItem(TOKEN_TYPE)),
            getToken: () => localStorage.getItem(TOKEN_TYPE)
        };

        return (
            !user 
            ? <LoginRoute  {...props} />
            : <Route {...props}/>
        );
    }
}


const HOCArgs = {
    providers: {
        googleProvider,
    },
    firebaseAppAuth: firebaseAuth,
};


export default (Route) => withFirebaseAuth(HOCArgs)((props) => <AuthRouter Route={Route} {...props}/>);

export { googleProvider, firebaseAuth };
