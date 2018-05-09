import React ,{ Component }from 'react'
import { Container, Row, Col } from 'reactstrap';
import { Card, CardImg, CardFooter, CardBody,
    CardTitle, CardText } from 'reactstrap';
import Cuny from '../../../../static/cuny.png'
import TechPrep from '../../../../static/CunyTechPrep.jpg'
import TTP from '../../../../static/ttp.png'

class CunyTech extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: true
        }
    }
    blink = ()=> {
        this.setState({ visible: !this.state.visible });
    }

    componentDidMount() {
        this.interval = setInterval(this.blink, 530);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return(
            <div style={{ backgroundColor: '#151516'}}>
                <Row>
                    <Col>
                        <Card body style={{backgroundColor: '#151516' }}>
                            <CardTitle style={{color: 'white'}}> 
                                Application Created In  <a href="https://cunytechprep.nyc/"> CUNY Tech Prep </a>
                            </CardTitle>
                            <CardText style={{color: 'white'}}>
                            > <span style={ { visibility: this.state.visible ? 'visible' : 'hidden'  } }> _  </span> 
                                A full stack JavaScript boot-camp for CUNY computer science majors to learn in-demand technologies, master professional soft skills, and land great tech jobs in NYC.
                            </CardText>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={3} md={3} sm={3} xs={3}>
                        <a href="http://www2.cuny.edu/">
                        <CardImg className="img-responsive img-circle center-block" style={{maxHight: '15em', maxWidth: '15em'}} src={Cuny} alt={"logo"}/> 
                    </a>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3} >
                        <a href="https://cunytechprep.nyc/">
                            <CardImg className="img-responsive img-circle center-block" style={{maxhight: '15em', maxwidth: '15em'}} src={TechPrep} alt={"logo"}/> 
                        </a>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3} >
                        <a href="http://www.techtalentpipeline.nyc/">
                            <CardImg className="img-responsive img-circle center-block" style={{maxhight: '15em', maxwidth: '15em'}} src={TTP} alt={"logo"}/> 
                        </a>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default CunyTech;
