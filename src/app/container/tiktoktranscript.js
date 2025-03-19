import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import common from '../../utils/common';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../../utils/apiService';
import Loading from 'react-fullscreen-loading';
import BarLoader from "react-spinners/BarLoader";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

class TiktokTranscript extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataUser: {},
            loadingDashboard: false,
            platforms: [],
            period: [],
            days: "1",
            keyword: "",
            showData: [],
            data: [],
            emptyKeyword: false,
            country: "",
            sorts: "1",
            cursors: 20,
            loading: false,
            tmpReq: {},
            loadingOnload: false,
            dataSuper: {
                id: "1",
                platform: "tiktok",
                video: "https://do4h0vy7erfx.cloudfront.net/7115327725044387118_8753e17478e400129763fa4c35ae4f7309b8221b.mp4",
                title: "Example of one content",
                comments: "300",
                likes: 2000,
                shares: "100000",
                unique_id:"1",
                source:"https://tiktok.com"
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
            loadingTr:false,
            dataPie:{},
            transcripttext:"" 
        }
        this.paragraphRef = React.createRef();

    }
    sliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
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
            if (this.state.dataUser.is_active === '0') {
                toast.warning("Please verify your email first, Thank You");
                this._goto("/profile");
            }
            let tmpDataList = reactLocalStorage.get('tmpData-tiktokdetail');
            if (tmpDataList) {
                let tmpDat = JSON.parse(tmpDataList);
                console.log("transcripttext : ", tmpDat.transcripttext);
                this.setState({ dataSuper: tmpDat, transcripttext:tmpDat.transcripttext ? tmpDat.transcripttext : ''}, () => {
                    let tmpReq = reactLocalStorage.get('tmpReq-tiktokdetail');
                    if (tmpReq) {
                        let tmpReqs = JSON.parse(tmpReq);
                        this.setState({ keyword: tmpReqs.link });
                    }
                    // this._transcript(JSON.parse(tmpDataList));
                })
            }

        });
    }


    _goto(v, param) {
        this.props.history.push(v, param, "_blank");
    }


    _getTiktokVideo = (loading) => {
        reactLocalStorage.remove('tmpData-tiktokdetail');
        this.setState({ data: [] }, () => {
            let tmpRequest = {
                "link": this.state.keyword,
                "user_id": this.state.dataUser.id_user
            };
            if (loading) {
                this._showLoading();
            }
            apiService.invoke("GET_TIKTOK_VIDEO_LINK", tmpRequest,
                (success) => {
                    this._hideLoading();
                    if (success.code === '200') {
                        let data = JSON.parse(success.data);
                        let dataResponse = data.aweme_detail;
                        if(dataResponse){
                            console.log("data : ",dataResponse);
                            let obj = {
                                id: dataResponse.aweme_id,
                                platform: "tiktok",
                                url: dataResponse.video.download_addr.url_list[2],
                                title: dataResponse.desc,
                                comment_count: dataResponse.statistics.comment_count,
                                like_count: dataResponse.statistics.digg_count,
                                share_count: dataResponse.statistics.share_count,
                                play_count: dataResponse.statistics.play_count,
                                nickname: dataResponse.author.nickname,
                                unique_id: dataResponse.author.unique_id,
                                region: dataResponse.region,
                                source: dataResponse.share_info.share_url
                            }
                            this.setState({dataSuper:obj}, () => {
                                reactLocalStorage.set("tmpData-tiktokdetail", JSON.stringify(obj));
                                reactLocalStorage.set("tmpReq-tiktokdetail", JSON.stringify(tmpRequest));
                                this._transcript(obj);
                            });
                        }else{
                            toast.error("Content not found, please search with other url!");

                        }
                    } else if (success.code === '302') {
                        toast.warning("Your tiktok search has reached limit, please upgrade plan");
                        this._goto("/upgrade");
                    } else if (success.code === '303') {
                        toast.warning("Your plan has expired, please upgrade plan");
                        this._goto("/upgrade");
                    }
                }, (error) => {
                    toast.error("Something went wrong, please reload page!");
                    this._hideLoading();
                });
        });

    }


    _showLoading() {
        this.setState({ loadingDashboard: true })
    }
    _hideLoading() {
        this.setState({ loadingDashboard: false })
    }

    _showLoading2() {
        this.setState({ loading: true })
    }
    _hideLoading2() {
        this.setState({ loading: false })
    }

    _showLoadingOnload() {
        this.setState({ loadingOnload: true })
    }
    _hideLoadingOnload() {
        this.setState({ loadingOnload: false })
    }



    _comingSoon() {
        toast.warning("This feature is still under development, Stay Tuned!");
    }

    _onChangeKeyword(evt) {
        let value = evt.target.value;
        this.setState({ keyword: value, emptyKeyword: false });
    }

    _onChangePeriod(evt) {
        let value = evt.target.value;
        this.setState({ days: value })
    }

    _transcript(dat) {
        console.log("trans data:", dat);
        let tmpRequest = {
            'url': dat.url,
            "user_id": this.state.dataUser.id_user
        }
        this.setState({loadingTr:true});
        apiService.invoke("TRANSCRIPT_VIDEO", tmpRequest,
            (success) => {
                this.setState({loadingTr:false});
                if (success.code === '200') {
                    let hasil = JSON.parse(success.data);
                    let tmpData = this.state.dataSuper;
                    tmpData['transcripttext'] = hasil.text;
                    this.setState({transcripttext:hasil.text, dataSuper:tmpData}, () => {
                        reactLocalStorage.set("tmpData-tiktokdetail", JSON.stringify(tmpData));
                    });
                } else if (success.code === '302') {
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this.setState({loadingTr:false});
            });
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this._getTiktokVideo(true);
        }
    }

    _handleCopy(){
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
        const { dataSuper, loading, loadingDashboard, emptyKeyword, loadingTr } = this.state;
        return (
            <div >
                <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <div className='row justify-content-center'>
                    <div className="col-md-12 mb-3">
                        <div className="card">
                            <div className='row p-3 pr-4'>
                                <div className="col-md-10 mb-2">
                                    <input onKeyDown={(e) => this._handleKeyDown(e)} onChangeCapture={(evt) => this._onChangeKeyword(evt)} type="text" placeholder="Tiktok Video Link (Ex : https://tiktok.com/@username/video/12345678910)" className={emptyKeyword ? "form-control border-danger" : "form-control"} value={this.state.keyword} />
                                </div>
                                <div className='col-md-2 mb-2'>
                                    <button style={{ height: 40 }} onClick={() => this._getTiktokVideo(true)} className='btn btn-primary w-100'>
                                        <span className='mdi mdi-magnify'></span> Transcribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {
                        loading === true ? (
                            <div className='col-md-12'>
                                <div className='card'>
                                    <div className='card-body text-primary'>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
                                            <BarLoader color={'#2e1c5e'} loading={true} size={60} height={5} />
                                        </div>
                                        <center style={{ marginBottom: '10%' }}>
                                            <h4 className='mt-3'>Searching...</h4>
                                        </center>
                                    </div>
                                </div>
                            </div>
                        ) : dataSuper.id !== '1' ? (
                            <div className='col-md-12'>
                                <div className="card">
                                    <div className="card-header">
                                        <div className='row'>
                                            <div className='col'>
                                                <h3 className=' text-primary'>{dataSuper?.title.substring(0, 55) + '...'}</h3>
                                            </div>
                                            <div className='col-auto'>
                                                {
                                                    loading ? null : (
                                                        <button onClick={() => this._transcript(this.state.dataSuper)} className='btn btn-semi mr-2'>
                                                            <span className='mdi mdi-message-text-outline mr-2'></span>
                                                            Re-Generate Transcript
                                                        </button>
                                                    )
                                                }
                                                <a href={'https://tiktok.com/@' + dataSuper?.unique_id} target='_blank' rel="noopener noreferrer" className='btn btn-primary mr-2'>
                                                    <span className='mdi mdi-account'></span>
                                                    User Profile
                                                </a>
                                                <a href={dataSuper.source} target='_blank' rel="noopener noreferrer" className='btn btn-dark mr-2'>
                                                    <span className='mdi mdi-share'></span>
                                                    See Post
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <video src={dataSuper?.url} style={{ height: 400 }} className='w-100' controls>
                                                </video>
                                            </div>
                                            <div className='col-md-8'>
                                                {
                                                    loadingTr ? (
                                                        <>
                                                            <div className='row mb-3'>
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
                                                        </>
                                                    ) : null
                                                }
                                                {
                                                    this.state.transcripttext === undefined || loadingTr ? null : (
                                                        <>
                                                            <div className='row mb-3'>
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
                                                        </>
                                                    )
                                                }
                                                <div className='row'>
                                                    <div className='col-md-3 mb-2'>
                                                        <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                            <div className='row pt-2 pl-2 pb-1'>
                                                                <div className='col-5'>
                                                                    <div className='btn btn-info'>
                                                                        <span className='mdi mdi-play-circle-outline fa-2x text-white'></span>
                                                                    </div>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <small>Views</small><br></br>
                                                                    <h5>{common.formatThousand(dataSuper?.play_count)}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-3 mb-2'>
                                                        <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                            <div className='row pt-2 pl-2 pb-1'>
                                                                <div className='col-5'>
                                                                    <div className='btn btn-info'>
                                                                        <span className='mdi mdi-thumb-up-outline fa-2x text-white'></span>
                                                                    </div>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <small>Likes</small><br></br>
                                                                    <h5>{common.formatThousand(dataSuper?.like_count)}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-3 mb-2'>
                                                        <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                            <div className='row pt-2 pl-2 pb-1'>
                                                                <div className='col-5'>
                                                                    <div className='btn btn-info'>
                                                                        <span className='mdi mdi-comment-multiple-outline fa-2x text-white'></span>
                                                                    </div>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <small>Comments</small><br></br>
                                                                    <h5>{common.formatThousand(dataSuper?.comment_count)}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-3 mb-2'>
                                                        <div className='card text-primary' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                            <div className='row pt-2 pl-2 pb-1'>
                                                                <div className='col-5'>
                                                                    <div className='btn btn-info'>
                                                                        <span className='mdi mdi-share fa-2x text-white'></span>
                                                                    </div>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <small>Share</small><br></br>
                                                                    <h5>{common.formatThousand(dataSuper?.share_count)}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='col-md-12'>
                                <div className='card'>
                                    <div className='card-body text-primary'>
                                        <div style={{ marginTop: '3%', marginBottom: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <center>
                                                <img alt="notfound" src={require('../../assets/images/search.png')} width={300} />
                                                <h2>There's nothing here<br></br><center><p className='mt-2'>Search the content by filling fields above.</p></center></h2>
                                            </center>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div >
        );
    }
}

export default TiktokTranscript;