import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import { Redirect } from 'react-router';

import moment from 'moment';
import q from 'q';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Header from '~/app/components/Header.jsx';
import INPUT_TYPES from '~/app/enums/InputTypes.jsx';
import AppContext from '~/app/AppContext.jsx';

import APIClient from '~/app/API';

const MONTHS_ALIAS = ['This Month','1 Month Ago','2 Months Ago','3 Months Ago','4 Months Ago'];

export default class MetricsRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            selected: MONTHS_ALIAS[1],
            [MONTHS_ALIAS[1]]: null,
            [MONTHS_ALIAS[2]]: null,
            [MONTHS_ALIAS[3]]: null,
            [MONTHS_ALIAS[4]]: null
        }
    }

    handleClick = ()=>{
        this.setState({
            redirect: true
        })
    }

    handleChange = (event)=>{
        //alert(event.target.value)
        this.setState({
            selected: event.target.value
        })
    }

    componentDidMount(){
        const token = this.props.auth.getToken();
        const client = new APIClient(token);
        const { state } = this.context;

        client.getMetrics(state[INPUT_TYPES.ViewId]).then((formattedResult)=>{
            this.setState(Object.assign(this.state,formattedResult));
        })

        this.client = client;
    }

    render() {

        if (this.state.redirect) {
            return <Redirect push to="/" />;
        }

        const token = this.props.auth.getToken();
        const { selected } = this.state;

        let data;

        if(MONTHS_ALIAS.indexOf(selected) && this.state[selected]){
            data = this.state[selected];
        }
        return (
            <Container>
                <AppContext.Consumer>
                    {({ state, handleChange }) =>
                        <div className='route'>
                            <Header />
                            <Button variant="danger" onClick={this.props.auth.signOut} size='sm'>SignOut</Button>
                            <Button variant="dark" onClick={this.handleClick} size='sm'>Go Back</Button>
                            <br />
                            <br />
                            <div className="form-element">
                                <label>Select Date Range:</label>
                                <select 
                                    value={this.state.selected}
                                    onChange={this.handleChange}>
                                    {
                                        MONTHS_ALIAS.map((monthAlias,i)=> {
                                            return (i === 0 ? null : <option key={`m-alias-${i}`} value={monthAlias}>{monthAlias}</option>)
                                        })
                                    }
                                </select>
                            </div>
                            <br/>
                            {
                                data && (
                                    <div>
                                        <Row>
                                            <Col>
                                                <label>Bounce Rate:</label>
                                                <h1> {data.bounceRate}</h1>
                                            </Col>
                                            <Col>
                                                <label>Sessions:</label>
                                                <h1> {data.sessions}</h1>
                                            </Col>
                                            <Col></Col>
                                        </Row>
                                        <br/>
                                        <Table striped bordered hover variant="dark">
                                            <thead>
                                                <tr>
                                                    <th>Page Path</th>
                                                    <th>Views</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.pageViews.map(row=>{
                                                        return (
                                                            <tr>
                                                                <td>{row.path}</td>
                                                                <td>{row.views}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                )
                            }
                            
                        </div>
                    }
                </AppContext.Consumer>
            </Container>
        )
    }
}


MetricsRoute.contextType = AppContext;