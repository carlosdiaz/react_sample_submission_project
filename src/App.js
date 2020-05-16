import React, { Component, createRef } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import SampleForm from './components/SampleForm'


const api = axios.create({
  baseURL: 'http://localhost:3001/samples'
})


class App extends Component{
  // Parent class
  // This component is in charge of rendering all the samples in a card view format
    constructor() {
        super();
        // we create a reference to the children element
        this.sampleRef = createRef()
        this.state = {
          samples : []
        }
        this.getSamples();
        this.handleAddSample = this.handleAddSample.bind(this);
        //this.getSampleId = this.getSampleId.bind(this);
        //this.getOnEditMode = this.getOnEditMode.bind(this);
    }
  

  getSamples = async () => {
      let data = await api.get('/').then(({data}) => data);
      this.setState({ samples: data})
  }
  

  getSampleId = async(itemId) => {
    // we call through the reference
    this.sampleRef.current.getSampleId(itemId);
  }


  deleteSample = async(itemId) => {
    // we delete the sample selected by the user
    // 
  
    try {
      //let data = await api.delete('/', { params: { id: itemId } })
      await api.delete('/' + itemId )
      // do we need to run the getSamples function?  
      this.getSamples();
    } catch (err) {
      console.log(err);
    }
  }


  handleAddSample(sample) {
    // This function will handle the state of the application, whenever a change is being made
    // on the state it will reflect the change 

    this.setState({
      samples: [...this.state.samples, sample]
    })
    this.getSamples();
  }
  
  // begin the section where all the card views are created
  render() {
    // this variable will allow to iterate among all the tasks that are created
    const samples = this.state.samples.map((sample, i) => {
      return (
        <div className="col-md-4" key={i}>
          <div className="card mt-4 shadow p-3 mb-3 bg-white rounded">
            <div className="card-title text-center">
            <button
            className="btn btn-info" onClick={this.getSampleId.bind(this, sample.id)}>
            {/* // className="btn btn-info"> */}
            <i className="fa fa-pencil-square-o"></i> 
          </button>
                <div className="mt-4">
                <h5>{sample.sample_name}</h5>
                </div>
              <span className="badge badge-pill badge- ml-2">
                {sample.test_type}
              </span>
            </div>
            <div className="card-body">
              <p className='text-center'>{sample.sample_collected}</p>
              <p className='text-center'>{sample.sample_type}</p>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-info btn-block" onClick={this.deleteSample.bind(this, sample.id)}>
                  <i className="fa fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )
    });
    // end

    // RETURN THE COMPONENT
    return (
      <div className="App">
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="/">
            <img src={logo}  alt="logo" />
            <span className="badge badge-pill badge-light ml-2">
              {/* {this.state.samples.length} */}
            </span>
          </a>
        </nav>

        <div className="container">
          <div className="row mt-4">
            <div className="col-md-4 text-center">
                {/* <img src={logo}  alt="logo" /> */}
                {/* <img src="logo.svg" className="App-logo" alt="logo" /> */}
              {/* <SampleForm onAddSample={this.handleAddSample}></SampleForm> */}
              <SampleForm onAddSample={this.handleAddSample} ref={this.sampleRef}></SampleForm>
            </div>
            <div className="col-md-8">
              <div className="row">
                {samples}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
