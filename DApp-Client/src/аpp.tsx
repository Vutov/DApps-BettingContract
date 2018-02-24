import * as React from 'react';
import { Link } from "react-router-dom";
import Infobox from './components/common/infobox';
import observer from './services/observer';
import { get } from './services/requester';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Badge } from 'react-bootstrap'

export class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    renderNavbar() {
        return <Navbar collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="https://softuni.bg/" target='blank'>Software University</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <NavItem eventKey={1}><Link to="/">Home</Link></NavItem>
                    <NavItem eventKey={2}><Link to="/events">Events</Link></NavItem>
                    <NavItem eventKey={3}><Link to="/history">Bet History</Link></NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    }

    renderFooter() {
        return (
            <footer className='footer'>
                <div className='container padding-10'>
                    <div className='text-center'>DApps - React, TypeScript, MetaМask - Spas Vutov | <a href="https://github.com/Vutov/DApps-BettingContract">GitHub</a></div>
                </div>
            </footer>
        )
    }

    render() {
        return (
            <div id="app">
                {this.renderNavbar.call(this)}
                <main id='main'>
                    <Infobox />
                    {this.props.children}
                </main>
                {this.renderFooter.call(this)}
            </div>
        )
    }
}