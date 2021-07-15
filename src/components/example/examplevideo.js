import React, { Component } from 'react';
import PreguntaDataService from "../../services/pregunta.service";
import {
    striped, bordered, hover, Table, Button, Text, View, Overview, Modal,
    InputGroup, FormControl, Form, Col, Jumbotron, Container, Badge, Row, OverlayTrigger, Overlay, Tooltip, Card, ListGroup
  } from 'react-bootstrap';
import ResponsivePlayer from './ResponsivePlayer';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.retrieveQuizs = this.retrieveQuizs.bind(this);
    this.handleWatchComplete = this.handleWatchComplete.bind(this);
    this.handleonStart= this.handleonStart.bind(this);
    this.state = {
      visible: false,
      stop: true,
      preguntas: [],
      played: 89,
      url: 'https://youtu.be/rWJSOhbrrVI'
    }
  };

  async componentDidMount() {
    await this.retrieveQuizs();
  }

  async retrieveQuizs() {
    var respuestas = [];
    var id = "606373be7efa1013283236a0"

    PreguntaDataService.get(id)
      .then(response => {
        respuestas.push(response.data);
      })
      .catch(e => {
        //console.log(e);
      });

    this.setState({ preguntas: respuestas });
  }

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
  pauseStop() {
    this.setState({
      stop: true
    });
  }
  playStop() {
    this.setState({
      stop: false
    });
  }
  handleWatchComplete(e){
      //console.log(e);
      if (e.playedSeconds > 10){
          this.openModal();
          this.playStop();        
      }
  }
  handleonStart(e){
    //console.log(e);
}

  render() {
    const {e} = this.state;

    return (
      <div>
        <ResponsivePlayer 
            url={this.state.url+'?t=1'}
            onProgress={this.handleWatchComplete}
            playing={this.state.stop}
            // played={this.state.played}
        />
        <Modal show={this.state.visible} size="xl" >
            <Modal.Header closeButton onClick={() => this.closeModal()} >
              <Modal.Title>Editar Curso</Modal.Title>
            </Modal.Header>
              <Modal.Body>
                <Form>

                </Form>
              </Modal.Body>


            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.closeModal()} >
                Cerrar
                        </Button>

              <Button variant="primary" >
                Editar
                        </Button>
            </Modal.Footer>

        </Modal>
      </div>



    );
  }
}