import React, {useState} from "react";
import SocketIo from "socket.io-client";
import { Container, Row, Col, Button } from 'reactstrap';

import "./tailwind.output.css";
import Games from "./Games";


export default function App(): JSX.Element {
    const [io, setIo] = useState<SocketIOClient.Socket>();

    const connectIoServer = () => {
        setIo(SocketIo(process.env.REACT_APP_HOSTNAME as string));
    };

    return (
        <Container>
            <Row>
                <Col sm="12" md={{ size: 6, offset: 4 }}>
                    <div style={{marginTop: '50%'}}>
                        {!io ?
                            (
                            <Button style={{height: 90, width:200}} color="primary"
                                    type="button"
                                    onClick={() => connectIoServer()}>Join games</Button>)
                            :
                                (
                                    <Games io={io}/>
                                )
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    );
}