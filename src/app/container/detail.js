import React, { Component } from 'react'
import apiService from '../../utils/apiService';
import 'react-toastify/dist/ReactToastify.css';
// import Loading from 'react-fullscreen-loading';
import { Pie } from 'react-chartjs-2';
import common from '../../utils/common';
import { reactLocalStorage } from 'reactjs-localstorage';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

class detailContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUser: {},
            data: {
                id: "1",
                platform: "tiktok",
                video: "https://do4h0vy7erfx.cloudfront.net/7115327725044387118_8753e17478e400129763fa4c35ae4f7309b8221b.mp4",
                title: "Example of one content",
                comments: "300",
                likes: 2000,
                shares: "100000"
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Likes and Shares',
                    },
                },
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'],
            transcripttext: ''
        }
        this.paragraphRef = React.createRef();

    }

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let islogin = reactLocalStorage.get('islogin');
        if (islogin === 'true' && datacred) {
            let data = this.props.history.location.state;
            if (data) {
                this.setState({ data: data, transcripttext: data.transcripttext }, () => {
                    if (this.state.transcripttext === '' || this.state.transcripttext === undefined) {
                    }
                });
            } else {
                this._goto('/dashboard');
            }
        } else {
            window.location.assign('/login');
        }
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

    _transcript(dat) {
        let tmpRequest = {
            'url': dat.url,
            "user_id": this.state.dataUser.id_user
        }
        this._showLoading();
        apiService.invoke("TRANSCRIPT_VIDEO", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    let hasil = JSON.parse(success.data);
                    this.setState({ transcripttext: hasil.text })
                } else if (success.code === '302') {
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoading();
            });
    }

    _handleCopy() {
        // Get the text content from the <p> element using the ref
        const textToCopy = this.paragraphRef.current.innerText;

        // Create a temporary textarea element
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;

        // Append the textarea to the document
        document.body.appendChild(tempTextArea);

        // Select the text in the textarea
        tempTextArea.select();

        // Execute the copy command
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);

        // Optionally, you can provide user feedback or perform other actions
        console.log('Text copied:', textToCopy);
        toast.success("Transcript Copied to Clipboard");

    }

    render() {
        const { loading, data } = this.state;
        const dataPie = {
            labels: ['Likes', 'Comments', 'Shares'],
            datasets: [
                {
                    label: 'Shares & Comments',
                    data: [data.like_count, data.comment_count, data.share_count],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
        return (
            <div>
                {/* <Loading text loading={loading} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" /> */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#!()" onClick={() => this._goto("/dashboard")}>Dashboard</a></li>
                        <li className="breadcrumb-item"><a href="#!()" onClick={() => this._goto("/tiktok")}>Tiktok</a></li>
                        <li className="breadcrumb-item " aria-current="page">{data.title.substring(0, 20) + '...'}</li>
                    </ol>
                </nav>
                <div className="row justify-content-center">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-header">
                                <div className='row'>
                                    <div className='col'>
                                        <h3 className=' text-primary'>{data.title.substring(0, 55) + '...'}</h3>
                                    </div>
                                    <div className='col-auto'>
                                        {
                                            loading ? null : (
                                                <button onClick={() => this._transcript(this.state.data)} className='btn btn-semi mr-2'>
                                                    <span className='mdi mdi-message-text-outline mr-2'></span>
                                                    Transcript
                                                </button>
                                            )
                                        }
                                        <a href={'https://tiktok.com/@' + data.unique_id} target='_blank' rel="noopener noreferrer" className='btn btn-primary mr-2'>
                                            <span className='mdi mdi-account'></span>
                                            User Profile
                                        </a>
                                        <a href={data.source} target='_blank' rel="noopener noreferrer" className='btn btn-dark mr-2'>
                                            <span className='mdi mdi-share'></span>
                                            See Post
                                        </a>
                                        <button onClick={() => this.props.history.goBack()} className='btn btn-semi mr-2'>
                                            <span className='mdi mdi-arrow-left'></span>
                                            Back
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className="card-body">
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <center>
                                            <img alt="" src={require('../../assets/images/tiktok.png')} width={100} />
                                        </center>
                                        <hr></hr>
                                        {
                                            data.url === '' || data.url === undefined ? (
                                                <>
                                                    <img src={require('../../assets/images/tiktokcarousel.png')} alt="" style={{ width: "100%" }} />
                                                    <a href={data.source} target='_blank' rel="noopener noreferrer" className='btn btn-dark w-100 mt-3'>
                                                        <span className='mdi mdi-share'></span>
                                                        See Post
                                                    </a>
                                                </>
                                            ) : (
                                                <video autoPlay src={data.url} style={{ height: 400 }} className='w-100' controls>
                                                </video>
                                            )
                                        }
                                    </div>
                                    <div className='col-md-8'>
                                        {
                                            loading ? (
                                                <>
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <div className='card' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                                <div className='card-header'>
                                                                    <div className='row'>
                                                                        <div className='col'>
                                                                            <h5 className=' text-primary'>Transcribing <i className='mdi mdi-loading mdi-spin'></i></h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='card-body text-primary'>
                                                                    <Skeleton height={20} width={'100%'} />
                                                                    <Skeleton height={20} width={'100%'} />
                                                                    <Skeleton height={20} width={'100%'} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr></hr>

                                                </>
                                            ) : null
                                        }
                                        {
                                            this.state.transcripttext === undefined || loading ? null : (
                                                <>
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <div className='card' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                                <div className='card-header'>
                                                                    <div className='row'>
                                                                        <div className='col'>
                                                                            <h5 className=' text-primary'>Transcript</h5>
                                                                        </div>
                                                                        <div className='col-auto'>
                                                                            <button onClick={() => this._handleCopy()} className='btn btn-info'>
                                                                                <i className='mdi mdi-content-copy'></i> Copy
                                                                            </button>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                <div className='card-body text-primary'>
                                                                    <p ref={this.paragraphRef}>{this.state.transcripttext === '' ? '...' : this.state.transcripttext}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr></hr>

                                                </>
                                            )
                                        }
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                    <div className='row pt-2 pl-2 pb-1'>
                                                        <div className='col-5'>
                                                            <div className='btn btn-info'>
                                                                <span className='mdi mdi-play-circle-outline fa-2x text-white'></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-7'>
                                                            <small>Views</small><br></br>
                                                            <h5>{common.formatThousand(data.play_count)}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                    <div className='row pt-2 pl-2 pb-1'>
                                                        <div className='col-5'>
                                                            <div className='btn btn-info'>
                                                                <span className='mdi mdi-thumb-up-outline fa-2x text-white'></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-7'>
                                                            <small>Likes</small><br></br>
                                                            <h5>{common.formatThousand(data.like_count)}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                    <div className='row pt-2 pl-2 pb-1'>
                                                        <div className='col-5'>
                                                            <div className='btn btn-info'>
                                                                <span className='mdi mdi-comment-multiple-outline fa-2x text-white'></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-7'>
                                                            <small>Comments</small><br></br>
                                                            <h5>{common.formatThousand(data.comment_count)}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                    <div className='row pt-2 pl-2 pb-1'>
                                                        <div className='col-5'>
                                                            <div className='btn btn-info'>
                                                                <span className='mdi mdi-share fa-2x text-white'></span>
                                                            </div>
                                                        </div>
                                                        <div className='col-7'>
                                                            <small>Share</small><br></br>
                                                            <h5>{common.formatThousand(data.share_count)}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <hr></hr>
                                        <Pie data={dataPie} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default detailContainer
