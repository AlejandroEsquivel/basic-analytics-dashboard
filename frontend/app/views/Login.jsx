import React from 'react';

import { SmallHeader } from '~/app/components/Header.jsx';
export default class LoginRoute extends React.Component {

    handleSubmit = ()=> this.props.auth.signIn()

    render() {

        return (
            <div className="login-route">
                <div className="container">

                    <SmallHeader/>
                    <br/>
                    <button className='login-btn' onClick={this.handleSubmit}>
                        <img className='vertical-align-middle' width="20px" alt="Google &quot;G&quot; Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"/> 
                        <span className='vertical-align-middle margin-left-5'>Sign in with Google</span>
                    </button>


                </div>
            </div>
        )

    }
}