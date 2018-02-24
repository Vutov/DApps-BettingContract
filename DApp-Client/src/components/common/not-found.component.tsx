import * as React from 'react'
import observer from '../../services/observer'
import { Row, Col } from 'react-bootstrap'

export class NotFoundComponent extends React.Component<any, any> {

    render() {
        return (
            <section className='container'>
                <Row>
                    <Col md={6} mdOffset={3} xs={8} xsOffset={2}>
                        <h1 className='lead text-center'>Page Not Found</h1>
                        <img className="margin-reset img-responsive" alt="not-found" src='https://img.buzzfeed.com/buzzfeed-static/static/2015-06/24/19/campaign_images/webdr09/this-may-be-this-cutest-saddest-cat-ever-2-4626-1435188004-0_dblbig.jpg' />
                    </Col>
                </Row>
            </section>
        );
    }
}