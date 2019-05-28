import React from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

import { Redirect } from 'react-router';

import Header from '~/app/components/Header.jsx';
import INPUT_TYPES from '~/app/enums/InputTypes.jsx';
import AppContext from '~/app/AppContext.jsx';


export default class HomeRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }
    handleClick = ()=>{
        this.setState({
            redirect: true
        })
    }
    componentDidMount(){
        const token = this.props.auth.getToken();
        this.context.getResources(token);

        console.log(`Token: ${token}`);
    }
    render() {
        if (this.state.redirect) {
            return <Redirect push to="/metrics" />;
        }

        const token = this.props.auth.getToken();

        return (
            <Container>
                <AppContext.Consumer>
                    {({ state, handleChange }) =>
                        <div className='route'>
                            <Header />
                            <Button variant="danger" onClick={this.props.auth.signOut} size='sm'>Sign Out</Button>
                            <br />
                            <br />
                            <div className="form-element">
                                <label>Account ID:</label>
                                <select 
                                    onChange={handleChange(INPUT_TYPES.AccountId,token)} 
                                    disabled={state.loadingMenu}
                                    value={state[INPUT_TYPES.AccountId]}>
                                    {
                                        state.accounts.map(account=> <option key={`account-${account.id}`} value={account.id}>{account.id}</option>)
                                    }
                                </select>
                            </div>
                            <div className="form-element">
                                <label>Property ID:</label>
                                <select 
                                    onChange={handleChange(INPUT_TYPES.PropertyId,token)} 
                                    disabled={state.loadingMenu}
                                    value={state[INPUT_TYPES.PropertyId]}>
                                    {
                                        state.properties.map(property=> <option key={`property-${property.id}`} value={property.id}>{property.id}</option>)
                                    }
                                </select>
                            </div>
                            <div className="form-element">
                                <label>View ID:</label>
                                <select 
                                    onChange={handleChange(INPUT_TYPES.ViewId,token)}
                                    disabled={state.loadingMenu}
                                    value={state[INPUT_TYPES.ViewId]}>
                                    {
                                        state.views.map(view=> <option key={`view-${view.id}`} value={view.id}>{view.id}</option>)
                                        
                                    }
                                </select>
                            </div>
                            <br/>
                            <Button variant="primary" block disabled={state.loadingMenu} onClick={this.handleClick}>Get Metrics</Button>
                        </div>
                    }
                </AppContext.Consumer>
            </Container>
        )
    }
}


HomeRoute.contextType = AppContext;