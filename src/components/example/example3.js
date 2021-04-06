import React, { Component } from 'react';
import PreguntaDataService from "../../services/pregunta.service";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Form, Modal } from 'react-bootstrap';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

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

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

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
      visible: false,
      preguntas: [],
      respuestas: [],
      selected1: [],
      selected2: [],
      selected3: [],
      selected4: []
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
        console.log(e);
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

      //con droppable1 la origen

      if ((droppable1 == "droppable1") && (droppable2 == "droppable2")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          preguntas: result.droppable1,
          selected1: result.droppable2
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable3")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          preguntas: result.droppable1,
          selected2: result.droppable3
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable4")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          preguntas: result.droppable1,
          selected3: result.droppable4
        });
      }

      if ((droppable1 == "droppable1") && (droppable2 == "droppable5")) {
        const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          preguntas: result.droppable1,
          selected4: result.droppable5
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

        this.setState({
          selected1: result.droppable2,
          preguntas: result.droppable1
        });
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

        this.setState({
          selected2: result.droppable3,
          preguntas: result.droppable1
        });
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

        this.setState({
          selected3: result.droppable4,
          preguntas: result.droppable1
        });
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

        this.setState({
          selected4: result.droppable5,
          preguntas: result.droppable1
        });
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
  render() {
    const { selected1, selected2, selected3, selected4, preguntas } = this.state;

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
                          key={item.id}
                          draggableId={item.id}
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
                              {item.titulo}
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
                          key={item.id}
                          draggableId={item.id}
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
                              {item.titulo}
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
                          key={item.id}
                          draggableId={item.id}
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
                              {item.titulo}
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
                          key={item.id}
                          draggableId={item.id}
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
                              {item.titulo}
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
                          key={item.id}
                          draggableId={item.id}
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
                              {item.titulo}
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

        <Modal show={this.state.visible} size="xl" >
          <Modal.Header closeButton onClick={() => this.closeModal()} >
            <div></div>
          </Modal.Header>
          <Modal.Body>
            <Form>
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
                                  key={item.id}
                                  draggableId={item.id}
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
                                      {item.titulo}
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
                                  key={item.id}
                                  draggableId={item.id}
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
                                      {item.titulo}
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
                                  key={item.id}
                                  draggableId={item.id}
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
                                      {item.titulo}
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
                                  key={item.id}
                                  draggableId={item.id}
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
                                      {item.titulo}
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
                                  key={item.id}
                                  draggableId={item.id}
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
                                      {item.titulo}
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
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div></div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}