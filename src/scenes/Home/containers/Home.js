import React from 'react'
import HomePage from '../components/HomePage/HomePage.js'
import CunyTech from '../components/CUNY-TECH-INFO/CunyTech.js'
import { Container, Row, Col } from 'reactstrap';
import About from '../components/About/About.js';

const style = {
    float: 'none',
    margin: '0 auto',
}

const Home = () => (
    <Container>
        <Row style={style}>
            <HomePage />
            <Col style={{paddingTop: 100, float: 'none', margin: '0 auto'}} lg={10} md={10} sm={10} xs={10}>
                <About />
            </Col>
            <Col style={{paddingTop: 100, float: 'none', margin: '0 auto'}} lg={10} md={10} sm={10} xs={10}>
                <CunyTech />
            </Col>
        </Row>
    </Container>
)
export default Home;
