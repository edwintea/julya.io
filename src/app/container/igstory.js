import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import Stories from 'react-insta-stories';

class IgStory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataUser: {},
            loadingDashboard: false,
            data: [],
            dataIg:{}
        }

    }

    timeout = 0;

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let islogin = reactLocalStorage.get('islogin');

        if (islogin === 'true' && datacred) {
        } else {
            window.location.assign('/login');
        }

        this.setState({
            dataUser: JSON.parse(datacred),
        }, () => {
            let data = this.props.history.location.state;
            if (data) {
                this.setState({ data: data.listStory, dataIg:data.dataIg });
            } else {
                this._goto('/dashboard');
            }
        });
    }

    _goto(v, param) {
        this.props.history.push(v, param);
    }


    render() {
        return (
            <div >
                <div className='row'>
                    <div className='col-md-4'>
                        <div className='card'>
                            <div className='card-header'>
                                <div className='row'>
                                    <div className='col'>
                                    <h5 className='text-primary'>{this.state.dataIg.username}</h5>
                                    </div>
                                    <div className='col-auto'>
                                        <button onClick={() => this._goto('/iguser')} className='btn btn-primary'>
                                            <i className='mdi mdi-arrow-left'></i> Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className=''>
                                <div>
                                    <center>
                                        {
                                            this.state.data.length > 0 ? (
                                                <Stories
                                                    stories={this.state.data}
                                                    defaultInterval={3000}
                                                    width={300}
                                                    height={500}
                                                    // onStoryEnd={() => this._goto("/iguser")}
                                                />
                                            ) : null
                                        }
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default IgStory;