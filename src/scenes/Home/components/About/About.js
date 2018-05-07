import React from 'react'
import { Container, Row, Col } from 'reactstrap';
import { Card, CardImg, CardFooter, CardBody,
    CardTitle, CardText } from 'reactstrap';
import Github from '../../../../static/gitub.svg';
const About = () => (
    <div style={{ backgroundColor: '#151516'}}>
        <Row>
            <Col>
                <Card body style={{backgroundColor: '#151516' }}>
                    <CardTitle style={{color: 'white'}}> 
                        Partify                     </CardTitle>
                    <CardText style={{color: 'white'}}>
                        This is a free open source Spotify-powered app that lets users host parties and have guests connect using their smartphones to submit and vote on songs. The app will only play the highest voted song and can connect to personal playlists.
                    </CardText>
                </Card>
            </Col>
        </Row>
        <Row> 
            <Col lg={3} md={3} sm={3} xs={3}>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} >
                <a href="https://github.com/SamuelWitke/Partify">  
                    <CardImg className="img-responsive img-circle center-block" style={{maxHight: '15em', maxWidth: '15em'}} src={Github} alt={"logo"}/> 
                </a>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} >
            </Col>
    </Row>
</div>
)
export default About;
