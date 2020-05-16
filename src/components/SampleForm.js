import React, { Component } from 'react';
import axios from 'axios'


const api = axios.create({
    baseURL: 'http://localhost:3001/samples'
})


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r && 0x3) || 0x8);
      return v.toString(16);
    });
  }
  

class SampleForm extends Component {
  // This component is the sample form used for creating and editing new samples
  constructor () {
    super();
    this.myRef = React.createRef();
    this.state = {
      sample_name: '',
      sample_type: 'Blood',
      sample_collected: '',
      sample_volume: '',
      sample_comment: '',
      test_type: 'ID-CHECK',
      test_comment: '',
      update_sample : false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createSample = this.createSample.bind(this);
    this.getSampleId = this.getSampleId.bind(this);
    this.updateSample = this.updateSample.bind(this);
    this.cancelSampleEditing = this.cancelSampleEditing.bind(this);

  }

  
  handleInputChange(e) {
    const {value, name} = e.target;
    this.setState({
      [name]: value
    });
  }

  createSample = async (e) => {
    e.preventDefault();

    try {
        const id  = uuidv4();
        const { sample_name, sample_type, sample_collected, sample_volume, sample_comment, test_type, test_comment } = this.state;
        await api.post('/', {id, sample_name, sample_type, sample_collected, sample_volume, sample_comment, test_type, test_comment})    
        // we set into the props the new value of adding a new task
        this.props.onAddSample(this.state);
        this.setState({
            sample_name: '',
            sample_type: 'Blood',
            sample_collected: '',
            sample_volume: '',
            sample_comment: '',
            test_type: 'ID-CHECK',
            test_comment: '',
            update_sample : false
        });
      } catch (err) {
        console.log(err);
    }
  }

  getSampleId = async (itemId) => {
    // this function will be called from the Parent sample to retrieve the sample information
    let data = await api.get('/'+ itemId).then(({data}) => data);

    this.setState({
      sample_name: data.sample_name,
      sample_type: data.sample_type,
      sample_collected: data.sample_collected,
      sample_volume: data.sample_volume,
      sample_comment: data.sample_comment,
      test_type: data.test_type,
      test_comment: data.test_comment,
      update_sample : true,
      sample_uuid: data.id
    });
    window.scrollTo(0, this.myRef.current.offsetTop);

  }

  updateSample = async(e) => {
    // we update the sample informacion, 
    e.preventDefault();
    // we get the itemId from the state
    
    try {
      let id  = this.state.sample_uuid;
      console.log(this.state);
      const { sample_name, sample_type, sample_collected, sample_volume, sample_comment, test_type, test_comment } = this.state;
      let res = await api.put('/' + id, {sample_name, sample_type, sample_collected, sample_volume, sample_comment, test_type, test_comment})    
      console.log(res);
      // we set into the props the new value of adding a new task
      this.props.onAddSample(this.state);
      this.setState({
          sample_name: '',
          sample_type: 'Blood',
          sample_collected: '',
          sample_volume: '',
          sample_comment: '',
          test_type: 'ID-CHECK',
          test_comment: '',
          update_sample : false
      });
    } catch (err) {
      console.log(err);
    }

  }

  cancelSampleEditing(e) {
        // we cancel the editining information functionality
        e.preventDefault();        
        try {
          this.setState({
              sample_name: '',
              sample_type: 'Blood',
              sample_collected: '',
              sample_volume: '',
              sample_comment: '',
              test_type: 'ID-CHECK',
              test_comment: '',
              update_sample : false
          });
        } catch (err) {
          console.log(err);
        }
  }


  render() {
    return (
      <div className="card">
        <form className="card-body">
          <div className="form-group">
            <input
              type="text"
              name="sample_name"
              className="form-control"
              value={this.state.sample_name}
              onChange={this.handleInputChange}
              placeholder="Sample Name" ref={this.myRef}
              />
          </div>
          <div className="form-group">
            <select
                name="sample_type"
                className="form-control"
                value={this.state.sample_type}
                onChange={this.handleInputChange}
              >
              <option>Blood</option>
              <option>CSF</option>
              <option>Saliva</option>
              <option>Tumor</option>
              <option>Urine</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="sample_collected"
              className="form-control"
              value={this.state.sample_collected}
              onChange={this.handleInputChange}
              placeholder="Sample Collected"
              />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="sample_volume"
              className="form-control"
              value={this.state.sample_volume}
              onChange={this.handleInputChange}
              placeholder="Sample Volume"
              />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="sample_comment"
              className="form-control"
              value={this.state.sample_comment}
              onChange={this.handleInputChange}
              placeholder="Sample Comment"
              />
          </div>
          <div className="form-group">
            <select
                name="test_type"
                className="form-control"
                value={this.state.test_type}
                defaultValue={this.state.test_type}
                onChange={this.handleInputChange}
              >
              <option>ID CHECK</option>
              <option>RNA</option>
              <option>RWGS</option>
              <option>WGS</option>
              <option>URWGS</option>
            </select>
          </div>

        {(() => {
        // there must be a better way to do this distinction, probably creating a different component
        // one for creating and second for editing
        if (this.state['update_sample']) {
          return (
            <div className="btn-group">
            <button className="btn btn-secondary pull-left mx-2" onClick={this.updateSample.bind()}>Update</button>
            <button className="btn btn-secondary pull-right mr-2" onClick={this.cancelSampleEditing.bind()}>Cancel</button>
            </div>
          )
        } else  {
          return (
            <button type="submit" className="btn btn-info" onClick={this.createSample.bind()}>Save</button>
          )
        }
      })()}
        </form>
      </div>
    )
  }

}

export default SampleForm;