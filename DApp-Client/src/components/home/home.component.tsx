import * as React from 'react'
import observer from '../../services/observer'
import { Link } from "react-router-dom";
import { Panel, Carousel } from 'react-bootstrap'

export class HomeComponent extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { user: sessionStorage.getItem('username') };
    }

    renderCarousel() {
        return (
            <Carousel>
                <Carousel.Item>
                    <img className="margin-reset" width={900} height={500} alt="900x500" src={'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-9/10423658_10153546300347399_6701050122459498296_n.jpg?oh=0dce2f0e82215afeb1ed3c6f04f600f5&oe=5B1C6CCB'} />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img className="margin-reset" width={900} height={500} alt="900x500" src={'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-9/10423658_10153546300347399_6701050122459498296_n.jpg?oh=0dce2f0e82215afeb1ed3c6f04f600f5&oe=5B1C6CCB'} />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img className="margin-reset" width={900} height={500} alt="900x500" src={'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-9/10423658_10153546300347399_6701050122459498296_n.jpg?oh=0dce2f0e82215afeb1ed3c6f04f600f5&oe=5B1C6CCB'} />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        );
    }

    render() {
        let title = <h1>Welcome</h1>;
        return (
            <section className='container'>
                <Panel header={title}>
                    ... to DApps Betting Client.
                </Panel>
                {this.renderCarousel()}
            </section>
        );
    }
}