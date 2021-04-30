import React, { Component } from 'react';
import PreguntaDataService from "../../services/pregunta.service";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  Accordion, Button, Form, Modal, Card, Table, OverlayTrigger, Tooltip, Col, Row
} from 'react-bootstrap';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const order = (list) => {
  const result = Array.from(list);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  let unique = [...new Set(destClone)];

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = unique;

  return result;
};

const move2 = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const sourceClone2 = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone2.splice(droppableSource.index, 1);

  destClone.push(removed);

  let unique = [...new Set(destClone)];

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = unique;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the preguntas look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 150
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.retrieveQuizs = this.retrieveQuizs.bind(this);
    this.getList = this.getList.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      preguntas: [],
      respuestas: [],
      selected1: [],
      selected2: [],
      selected3: [],
      selected4: [],
      usados: []
    }
  };

  async componentDidMount() {
    await this.retrieveQuizs();
  }

  async retrieveQuizs() {
    var respuestas = [], opcions = [];
    var id = "606373be7efa1013283236a0"

    PreguntaDataService.get(id)
      .then(response => {
        respuestas.push(response.data);

        opcions.push(response.data.opcion1)
        opcions.push(response.data.opcion2)
        opcions.push(response.data.opcion3)
        opcions.push(response.data.opcion4)
      })
      .catch(e => {
        console.log(e);
      });

    this.setState({ preguntas: opcions });
  }

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable1 container to the names of the
   * source arrays stored in the state.
   */

  id2List = {
    droppable1: 'preguntas',
    droppable2: 'selected1',
    droppable3: 'selected2',
    droppable4: 'selected3',
    droppable5: 'selected4'
  };

  getList(id) {
    return this.state[this.id2List[id]];
  }

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const preguntas = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { preguntas };

      if (source.droppableId === 'droppable2') {
        state = { selected1: preguntas };
      }

      if (source.droppableId === 'droppable3') {
        state = { selected2: preguntas };
      }

      if (source.droppableId === 'droppable4') {
        state = { selected3: preguntas };
      }

      if (source.droppableId === 'droppable5') {
        state = { selected4: preguntas };
      }

      this.setState(state);
    } else {

      var droppable1 = source.droppableId;
      var droppable2 = destination.droppableId;
      var usados = this.state.usados.slice();

      //con droppable1 la origen

      if ((droppable1 == "droppable1") && (droppable2 == "droppable2")) {
        const result = move2(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        for (var i = 0; i < this.state.preguntas.length; i++) {
          if (i == source.index) {
            usados.push(this.state.preguntas[i])
          }
        }

        let unique = [...new Set(usados)];

        this.setState({
          preguntas: result.droppable1,
          selected1: result.droppable2,
          usados: unique
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable3")) {
        const result = move2(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        for (var i = 0; i < this.state.preguntas.length; i++) {
          if (i == source.index) {
            usados.push(this.state.preguntas[i])
          }
        }

        let unique = [...new Set(usados)];

        this.setState({
          preguntas: result.droppable1,
          selected2: result.droppable3,
          usados: unique
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable4")) {
        const result = move2(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        for (var i = 0; i < this.state.preguntas.length; i++) {
          if (i == source.index) {
            usados.push(this.state.preguntas[i])
          }
        }

        let unique = [...new Set(usados)];

        this.setState({
          preguntas: result.droppable1,
          selected3: result.droppable4,
          usados: unique
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable5")) {
        const result = move2(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        for (var i = 0; i < this.state.preguntas.length; i++) {
          if (i == source.index) {
            usados.push(this.state.preguntas[i])
          }
        }

        let unique = [...new Set(usados)];

        this.setState({
          preguntas: result.droppable1,
          selected4: result.droppable5,
          usados: unique
        });
      }

      //con droppable1 la lista droppable2

      if ((droppable1 == "droppable2") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );
        var cadena = {...this.getList(source.droppableId)};
        var index  = source.index;
        var moving = cadena[index];
        
        this.setState({
          selected1: result.droppable2,
          preguntas: result.droppable1
        });

        var bools2 = this.state.selected2.some(s2 => s2 === moving);
        var bools3 = this.state.selected3.some(s3 => s3 === moving);
        var bools4 = this.state.selected4.some(s4 => s4 === moving);
     
        if ( !bools2 && !bools3 && !bools4) {
          var lusados = this.state.usados.filter( u => u != moving);
          this.setState({
            usados: lusados
          });
        }
        

      }

      if ((droppable1 == "droppable2") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected1: result.droppable2,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable2") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected1: result.droppable2,
          selected3: result.droppable4
        });
      }

      if ((droppable1 == "droppable2") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected1: result.droppable2,
          selected4: result.droppable5
        });
      }

      //con droppable1 la lista droppable3

      if ((droppable1 == "droppable3") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected2: result.droppable3,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable3") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        var cadena = {...this.getList(source.droppableId)};
        var index  = source.index;
        var moving = cadena[index];

        this.setState({
          selected2: result.droppable3,
          preguntas: result.droppable1
        });
        var bools1 = this.state.selected1.some(s1 => s1 === moving);
        var bools3 = this.state.selected3.some(s3 => s3 === moving);
        var bools4 = this.state.selected4.some(s4 => s4 === moving);
     
        if ( !bools1 && !bools3 && !bools4) {
          var lusados = this.state.usados.filter( u => u != moving);
          this.setState({
            usados: lusados
          });
        }
      }

      if ((droppable1 == "droppable3") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected2: result.droppable3,
          selected3: result.droppable4
        });
      }

      if ((droppable1 == "droppable3") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected2: result.droppable3,
          selected4: result.droppable5
        });
      }

      //con droppable1 la lista droppable4

      if ((droppable1 == "droppable4") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected3: result.droppable4,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable4") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        var cadena = {...this.getList(source.droppableId)};
        var index  = source.index;
        var moving = cadena[index];

        this.setState({
          selected3: result.droppable4,
          preguntas: result.droppable1
        });

        var bools1 = this.state.selected1.some(s1 => s1 === moving);
        var bools2 = this.state.selected2.some(s2 => s2 === moving);
        var bools4 = this.state.selected4.some(s4 => s4 === moving);
     
        if ( !bools1 && !bools2 && !bools4) {
          var lusados = this.state.usados.filter( u => u != moving);
          this.setState({
            usados: lusados
          });
        }

      }

      if ((droppable1 == "droppable4") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected3: result.droppable4,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable4") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected3: result.droppable4,
          selected4: result.droppable5
        });
      }

      //con droppable1 la lista droppable5

      if ((droppable1 == "droppable5") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected4: result.droppable5,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable5") && (droppable2 == "droppable1")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );
        var cadena = {...this.getList(source.droppableId)};
        var index  = source.index;
        var moving = cadena[index];

        this.setState({
          selected4: result.droppable5,
          preguntas: result.droppable1
        });

        var bools1 = this.state.selected1.some(s1 => s1 === moving);
        var bools2 = this.state.selected2.some(s2 => s2 === moving);
        var bools3 = this.state.selected3.some(s3 => s3 === moving);
     
        if ( !bools1 && !bools2 && !bools3) {
          var lusados = this.state.usados.filter( u => u != moving);
          this.setState({
            usados: lusados
          });
        }

      }

      if ((droppable1 == "droppable5") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected4: result.droppable5,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable5") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          selected4: result.droppable5,
          selected3: result.droppable4
        });
      }
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity

  deleteStock(stock) {
    for (var i = 0; i < this.state.selected1.length; i++) {
      if (this.state.selected1[i] == stock) {
        this.state.selected1.splice(i, 1);

        const selected1 = order(
          this.state.selected1
        );

        let state = { selected1 };
        state = { selected1: selected1 };
        this.setState(state);
      }
    }

    for (var i = 0; i < this.state.selected2.length; i++) {
      if (this.state.selected2[i] == stock) {
        this.state.selected2.splice(i, 1);

        const selected2 = order(
          this.state.selected2
        );

        let state = { selected2 };
        state = { selected2: selected2 };
        this.setState(state);
      }
    }

    for (var i = 0; i < this.state.selected3.length; i++) {
      if (this.state.selected3[i] == stock) {
        this.state.selected3.splice(i, 1);

        const selected3 = order(
          this.state.selected3
        );

        let state = { selected3 };
        state = { selected3: selected3 };
        this.setState(state);
      }
    }

    for (var i = 0; i < this.state.selected4.length; i++) {
      if (this.state.selected4[i] == stock) {
        this.state.selected4.splice(i, 1);

        const selected4 = order(
          this.state.selected4
        );

        let state = { selected4 };
        state = { selected4: selected4 };
        this.setState(state);
      }
    }

    for (var i = 0; i < this.state.usados.length; i++) {
      if (this.state.usados[i] == stock) {
        this.state.usados.splice(i, 1);

        const usados = order(
          this.state.usados
        );

        let state = { usados };
        state = { usados: usados };
        this.setState(state);
      }
    }
  }

  render() {
    const { selected1, selected2, selected3, selected4, preguntas, usados } = this.state;

    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="list row">
            <div className="col-md-2">
              <Droppable droppableId="droppable1">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {preguntas &&
                      preguntas.map((item, index) => (
                        <Draggable
                          key={item}
                          draggableId={item + index}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              {item}
                              {usados &&
                                usados.map((stock) => (
                                  <div>
                                    {item == stock ? (
                                      <div>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">En uso</Tooltip>}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                                          </svg>
                                        </OverlayTrigger>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Eliminar</Tooltip>}>
                                          <Button size="sm" variant="link" onClick={() => this.deleteStock(stock)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-x" viewBox="0 0 16 16">
                                              <path fill-rule="evenodd" d="M6.146 5.146a.5.5 0 0 1 .708 0L8 6.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 7l1.147 1.146a.5.5 0 0 1-.708.708L8 7.707 6.854 8.854a.5.5 0 1 1-.708-.708L7.293 7 6.146 5.854a.5.5 0 0 1 0-.708z" />
                                              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                                            </svg>
                                          </Button>
                                        </OverlayTrigger>
                                      </div>
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="col-md-2">
              <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {selected1 &&
                      selected1.map((item, index) => (
                        <Draggable
                          key={item}
                          draggableId={item + index + index}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              {item}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="col-md-2">
              <Droppable droppableId="droppable3">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {selected2 &&
                      selected2.map((item, index) => (
                        <Draggable
                          key={item}
                          draggableId={item + index + index + index}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              {item}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="col-md-2">
              <Droppable droppableId="droppable4">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {selected3 &&
                      selected3.map((item, index) => (
                        <Draggable
                          key={item}
                          draggableId={item + index + index + index + index}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              {item}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="col-md-2">
              <Droppable droppableId="droppable5">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {selected4 &&
                      selected4.map((item, index) => (
                        <Draggable
                          key={item}
                          draggableId={item + index + index + index + index + index}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              {item}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
    );
  }
}