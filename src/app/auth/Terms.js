import React, { Component } from 'react';
import config from '../../utils/config';
import {Link} from 'react-router-dom';

class Terms extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }

  }

  componentDidMount() {
   
  }

  _goto(v) {
    this.props.history.push(v);
  }


  _showLoading() {
    this.setState({ loading: true })
  }
  _hideLoading() {
    this.setState({ loading: false })
  }


  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <center>
                  <div className="mb-4">
                    <img src={require("../../assets/images/logo.png")} alt="logo" width={80} />
                  </div>
                  <h3 className='text-black'>{config.APP_INFO.APP_Name}</h3>
                  <h6 className="font-weight-dark text-black">Terms and Conditions</h6>

                </center>
                <div className="pt-3">
                <p className='text-primary'><Link to="/register">Go Back</Link></p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Terms
