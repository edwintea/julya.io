import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import common from '../../utils/common';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../../utils/apiService';
import Select from 'react-select';
import Loading from 'react-fullscreen-loading';
import { Link } from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";

class SavedContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataUser: {},
            loadingDashboard: false,
            platforms: [
                {
                    label: "TikTok",
                    value: "tiktok"
                },
                {
                    label: "Facebook",
                    value: "fb"
                },
                {
                    label: "Instagram",
                    value: "instagram"
                },
                {
                    label: "Pinterest",
                    value: "pinterest"
                }
            ],
            period: [
                {
                    label: "Last 24 Hours",
                    value: "1"
                },
                {
                    label: "This Week",
                    value: "7"
                },
                {
                    label: "This Month",
                    value: "30"
                },
                {
                    label: "Last 3 Months",
                    value: "90"
                },
                {
                    label: "Last 6 Months",
                    value: "180"
                }
            ],
            days: "1",
            keyword: "",
            showData: [],
            data: [],
            emptyKeyword: false,
            emptyCountry: false,
            country: "",
            sorts: "1",
            cursors: 20,
            loading: false,
            offset: 40

        }

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
            this._getTiktokVideo();
        });
    }

    _goto(v, param) {
        this.props.history.push(v, param, "_blank");
    }

    _getTiktokVideo = () => {
        let tmpRequest = {
            'id_user': this.state.dataUser.id_user,
        };
        this._showLoading2();
        this._showLoading();
        console.log("tmp req : ", tmpRequest);
        apiService.invoke("GET_SAVED_CONTENT", tmpRequest,
            (success) => {
                this._hideLoading2();
                this._hideLoading();
                let final = [];
                if (success.code === '200') {
                    let dataPost = success.data.reverse();
                    console.log('dataPost : ', dataPost);
                    if (dataPost) {
                        for (let index = 0; index < dataPost.length; index++) {
                            let content = JSON.parse(dataPost[index].saved_content);
                            console.log('content : ', content);
                            let obj = {
                                id: content.id,
                                platform: "tiktok",
                                url: content.url,
                                title: content.title,
                                comment_count: content.comment_count,
                                like_count: content.like_count,
                                share_count: content.share_count,
                                play_count: content.play_count,
                                nickname: content.nickname,
                                unique_id: content.unique_id,
                                region: content.region,
                                source: content.source,
                                id_saved:dataPost[index].id_saved
                            };
                            final.push(obj);
                        }
                        this.setState({ showData: final, data: final }, () => {
                        });

                    } else {
                        toast.error("Something went wrong, please try again later!");
                    }
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoading();
            });
    }

    _deleteSave = (id, content) => {
        let tmpRequest = {
            'id_saved': id
        };
        this._showLoading();

        apiService.invoke("DELETE_SAVE", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    toast.success("Succesfuly Delete Content");
                    this._getTiktokVideo();
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoading();
            });
    }

    _onChangeSort(evt) {
        let value = evt.target.value;
        this.setState({
            sorts: value
        }, () => {
            let data = this.state.data;
            if (data.length > 0) {
                if (value !== '1' && value !== '0') {
                    let filter = [];
                    if (value === 'comments') {
                        filter = data.sort(
                            (p1, p2) => (p1.comment_count < p2.comment_count) ? 1 : (p1.comment_count > p2.comment_count) ? -1 : 0);
                    } else if (value === 'shares') {
                        filter = data.sort(
                            (p1, p2) => (p1.share_count < p2.share_count) ? 1 : (p1.share_count > p2.share_count) ? -1 : 0);
                    }
                    this.setState({ showData: filter });
                }
            }
        })
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


    onChangeSearch = (val) => {
        const { data } = this.state;
        if (val) {
            this.setState({ hasilFilter: [], keyword: val.target.value }, () => {
                let filteredResult = [];
                let val = this.state.keyword;
                var filteredValue = data.filter(item => item.title.toLowerCase().indexOf(val) > -1);
                if (filteredValue.length !== 0) {
                    filteredResult = filteredValue;
                }
                if (filteredResult.length !== 0) {
                    this.setState({ showData: filteredResult });
                }
            });
        } else {
            this.setState({ hasilFilter: data });
        }
    }

    onChangeRegion = (val) => {
        const { data } = this.state;
        if (val) {
            this.setState({ hasilFilter: [], country: val }, () => {
                let filteredResult = [];
                let val = this.state.country;
                var filteredValue = data.filter(item => item.region.indexOf(val) > -1);
                if (filteredValue.length !== 0) {
                    filteredResult = filteredValue;
                }
                console.log('filter : ', filteredResult);
                this.setState({ showData: filteredResult });
            });
        } else {
            this.setState({ hasilFilter: data });
        }
    }

    _renderTiktokVideo = (dat) => {
        return (
            <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                <div className='card-header'>
                    <div className='row'>
                        <div className='col'>
                            <img alt="" src={require('../../assets/images/tiktok.png')} width={80} />
                        </div>
                        <div className='col-auto'>
                            <Link title="Delete" className="btn btn-sm btn-danger" onClick={() => this._deleteSave(dat.id_saved)}>
                                <i className='mdi mdi-delete'></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='text-black'>
                    <video controls controlsList="nodownload" src={dat.url} style={{ height: 200 }} className='w-100'>
                    </video>
                    <div className='mt-3 pl-3 pr-3 pb-2'>
                        <h4><Link onClick={() => this._goto('detail', dat)}>{dat.title.substring(0, 40) + '...'}</Link></h4>
                        <div className='row text-primary'>
                            <div className='col'>
                                <p><i className='mdi mdi-account'></i> {dat.nickname.substring(0, 15) + '...'}</p>
                            </div>
                            <div className='col-auto'>
                                <p><i className='fa fa-globe'></i> {dat.region}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card-footer text-primary'>
                    <div className='row justify-content-center'>
                        <div className='col-md-3'>
                            <center>
                                <span><i className='mdi mdi-play-circle-outline fa-1x'></i></span>
                                <h4>{common.formatThousand(dat.play_count)}</h4>
                            </center>
                        </div>
                        <div className='col-md-3'>
                            <center>
                                <span><i className='mdi mdi-thumb-up-outline fa-1x'></i></span>
                                <h4>{common.formatThousand(dat.share_count)}</h4>
                            </center>
                        </div>
                        <div className='col-md-3'>
                            <center>
                                <span><i className='mdi mdi-comment-multiple-outline fa-1x'></i></span>
                                <h4>{common.formatThousand(dat.comment_count)}</h4>
                            </center>
                        </div>

                        <div className='col-md-3'>
                            <center>
                                <span><i className='mdi mdi-share-variant fa-1x'></i></span>
                                <h4>{common.formatThousand(dat.share_count)}</h4>
                            </center>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this._getTiktokVideo(true);
        }
    }

    render() {
        const { showData, loading, loadingDashboard, emptyKeyword, emptyCountry } = this.state;
        return (
            <div >
                <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <div className='row justify-content-center'>
                    <div className="col-md-12 mb-3">
                        <div className="card">
                            <div className='row p-3 pr-4'>
                                <div className="col-md-6 mb-2">
                                    <div className="input-group">
                                        <div className="input-group-append">
                                            <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                <span className='mdi mdi-magnify'></span>
                                            </div>
                                        </div>
                                        <input onChangeCapture={(evt) => this.onChangeSearch(evt)} type="text" placeholder="Keywords..." className={emptyKeyword ? "form-control border-danger" : "form-control"} value={this.state.keyword} />
                                    </div>
                                    {
                                        emptyKeyword ? (
                                            <label style={{ color: "red", fontSize: 14, marginTop: 10 }}>Keyword required!</label>
                                        ) : null
                                    }
                                </div>
                                <div className="col-md-4 mb-2">
                                    <Select
                                        ref={this.selectNasabah}
                                        placeholder={"Country..."}
                                        onChange={(val) => this.onChangeRegion(val.value)}
                                        styles={{
                                            option: (base) => ({
                                                ...base,
                                                height: '100%',
                                                color: "#000",
                                            }),
                                        }}
                                        options={common.listCountry()}
                                    />
                                    {
                                        emptyCountry ? (
                                            <label style={{ color: "red", fontSize: 14, marginTop: 10 }}>Region/Country required!</label>
                                        ) : null
                                    }
                                </div>
                                <div className='col-md-2 mb-2'>
                                    <button style={{ height: 40 }} onClick={() => window.location.reload()} className='btn btn-primary w-100'>
                                        <span className='mdi mdi-refresh'></span> Refresh
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {
                        loading ? (
                            <div className='col-md-12'>
                                <div className='card'>
                                    <div className='card-body text-primary'>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
                                            <BarLoader color={'#2e1c5e'} loading={true} size={60} height={5} />
                                        </div>
                                        <center style={{ marginBottom: '10%' }}>
                                            <h4 className='mt-3'>Loading...</h4>

                                        </center>

                                    </div>
                                </div>
                            </div>
                        ) : showData.length > 0 ? showData.map((dat) => {
                            return (
                                <div className='col-md-3'>
                                    {this._renderTiktokVideo(dat)}
                                </div>
                            )
                        })
                            : (
                                <div className='col-md-12'>
                                    <div className='card'>
                                        <div className='card-body text-primary'>
                                            <div style={{ marginTop: '3%', marginBottom: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <center>
                                                    <img alt="notfound" src={require('../../assets/images/search.png')} width={300} />
                                                    <h2>There's nothing here<br></br><center><p className='mt-2'>You can saved content from the platforms page.</p></center></h2>
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

export default SavedContent;