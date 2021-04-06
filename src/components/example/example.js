import React, { Component } from "react";
import Draggable from "react-draggable";

import {
  Button, OverlayTrigger, Tooltip, Card, Table, Accordion, Modal
} from 'react-bootstrap';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    
    this.state = {
      disabled: false,
      deltaPosition: {
        x: 0, y: 0
      }
    }
  };

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
  }

  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  toggleDraggable = () =>
    this.setState(prevState => ({ disabled: !this.state.disabled }));

  render = () => {
    const { disabled, deltaPosition } = this.state;
    return (
      <div>
        <div className="list row">
          <div className="col-md-5">
            <br></br>
            <img class="center" src="./cuerpo-humano.png" height="450" />
          </div>

          <div className="col-md-7">
            <br></br>
            <Table striped bordered hover>
              <h3 class="center">Preguntas Frecuentes</h3>
              <Accordion defaultActiveKey="0">
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    ¿Qué hago?
                     </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>Mueva la tijera por encima del cuerpo, identificar qué lugar del cuerpo debe cortar quirúrgicamente es importante, de este modo evitará cualquier accidente.</Card.Body>
                </Accordion.Collapse>
              </Accordion>
            </Table>
            {" "}
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Responder Quiz</Tooltip>}>
              <Button size="sm" variant="warning" onClick={() => this.openModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
              </Button>
            </OverlayTrigger>

            <Draggable disabled={disabled}>
              <div style={{ width: 100 }}>
                <img class="center" src="./tijeras.png" width="50" height="50" />
                <br />
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mueveme</Tooltip>}>
                  <Button size="md" variant="light" onClick={() => this.toggleDraggable}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" fill="currentColor" class="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                      <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                    </svg>
                  </Button>
                </OverlayTrigger>
              </div>
            </Draggable>

            <Draggable onDrag={this.handleDrag}>
              <div style={{ width: 100 }}>
                <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
                <img class="center" src="./tijeras.png" width="50" height="50" />
                <br />
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mueveme</Tooltip>}>
                  <Button size="md" variant="light" onClick={() => this.toggleDraggable}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" fill="currentColor" class="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                      <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                    </svg>
                  </Button>
                </OverlayTrigger>
              </div>
            </Draggable>

            <div className="box-drag" style={{ height: '500px', width: '500px', position: 'relative', overflow: 'auto', padding: '0' }}>
              <div style={{ height: '495px', padding: '10px' }}>
                <Draggable bounds="parent">
                  <div className="box-drag">
                    I can only be moved within my offsetParent.<br /><br />
                    Both parent padding and child margin work properly.
                  </div>
                </Draggable>
                <Draggable bounds="parent" onDrag={this.handleDrag}>
                  <div className="box-drag-white" style={{ width: 100 }}>
                    <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
                    <img class="center" src="./tijeras.png" width="50" height="50" />
                    <br />
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mueveme</Tooltip>}>
                      <Button size="md" variant="light" onClick={() => this.toggleDraggable}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" fill="currentColor" class="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                          <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                        </svg>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </Draggable>
              </div>
            </div>
          </div>
        </div>

        <Modal show={this.state.visible} size="xl" >
          <Modal.Header closeButton onClick={() => this.closeModal()} >
            <Modal.Title>Responder Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="box-drag" style={{ height: '400px', width: '1080px', position: 'relative', overflow: 'auto', padding: '0' }}>
              <div style={{ height: '385px', width: '1065px', padding: '10px' }}>

                <div className="list row">

                  <div className="col-md-4">
                    <img class="center" src="./cuerpo-humano.png" height="370" />
                  </div>

                  <div className="col-md-4">
                    <br></br>
                    <p>preguntapreguntapreguntapreguntapregunta
                    preguntapreguntapreguntapreguntapregunta
                    preguntapreguntapreguntapreguntapregunta
                    preguntapreguntapreguntapreguntapregunta</p>
                  </div>

                  <div className="col-md-4">
                    <Table striped bordered hover>
                      <h5 class="center">Preguntas Frecuentes</h5>
                      <Accordion defaultActiveKey="0">
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            ¿Qué hago?
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>En este tipo de pregunta, usted debe mover el icono que se le indica y seguir las instrucciones que describe el ejercicio.</Card.Body>
                        </Accordion.Collapse>
                      </Accordion>
                    </Table>

                    <Draggable onDrag={this.handleDrag}>
                      <div className="box-drag-white" style={{ width: 100 }}>
                        <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
                        <img class="center" src="./tijeras.png" width="50" height="50" />
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Mueveme</Tooltip>}>
                          <Button size="sm" variant="light" onClick={() => this.toggleDraggable}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" fill="currentColor" class="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                              <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                            </svg>
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </Draggable>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div></div>
          </Modal.Footer>
        </Modal>
        <br></br>
      </div>
    );
  };
}
