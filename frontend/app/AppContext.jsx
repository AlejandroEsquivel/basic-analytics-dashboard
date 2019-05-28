import React from 'react';

const AppContext = React.createContext();

import INPUT_TYPES from '~/app/enums/InputTypes.jsx';
import APIClient from '~/app/API';

class AppProvider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingMenu: true,
            accounts: [],
            properties: [],
            views: [],
            [INPUT_TYPES.AccountId]: '',
            [INPUT_TYPES.PropertyId]: '',
            [INPUT_TYPES.ViewId]: ''
        };
        this.client = new APIClient();
    }

    getResources  = (token,type,value)=>{

        this.client.token = token;

        const currState = this.state;

        let nextState = {};
        let selection = {
            [INPUT_TYPES.AccountId]: this.state[INPUT_TYPES.AccountId],
            [INPUT_TYPES.PropertyId]: this.state[INPUT_TYPES.PropertyId]
        };

        if(type){
            switch(type){
                case INPUT_TYPES.AccountId:
                    selection[INPUT_TYPES.PropertyId] = '';
                    selection[INPUT_TYPES.ViewId] = '';
                break;
                case INPUT_TYPES.PropertyId:
                    selection[INPUT_TYPES.ViewId] = '';
                break;  
                case INPUT_TYPES.ViewId:
                    return this.setState({
                        [INPUT_TYPES.ViewId]: value
                    })
                break;  
            }

            selection[type] = value;
            
            this.setState(Object.assign(currState,selection,{ loadingMenu: true }))
        }

        // this can be optimized to prevent unnecessary calls to API, leaving as is due to time constraints.
        this.client.getAccounts()
            .then(accounts=>{

                nextState.accounts = accounts;

                selection[INPUT_TYPES.AccountId] = selection[INPUT_TYPES.AccountId] || nextState.accounts[0].id;

                return !nextState.accounts.length ? [] : this.client.getProperties(selection[INPUT_TYPES.AccountId])
            })
            .then((properties)=>{

                nextState.properties = properties;

                selection[INPUT_TYPES.PropertyId] = selection[INPUT_TYPES.PropertyId] || nextState.properties[0].id;

                return !nextState.properties.length ? []: this.client.getViews(selection[INPUT_TYPES.AccountId],selection[INPUT_TYPES.PropertyId])
            })
            .then((views)=>{

                nextState.views = views;

                selection[INPUT_TYPES.ViewId] = selection[INPUT_TYPES.ViewId] || nextState.views[0].id;

            })
            .then(()=>{
                nextState.loadingMenu = false;
                this.setState(Object.assign(currState,nextState,selection));
            })
    }

    handleChange = (inputType,token) => event => {
        const value = event.target.value;
        this.getResources(token,inputType,value);
    }

    render() {
        const api = {
            state: this.state,
            handleChange: this.handleChange,
            getResources: this.getResources
        }
        return <AppContext.Provider value={api}>
            {this.props.children}
        </AppContext.Provider>
    }
}

export default AppContext;

export { AppProvider };
