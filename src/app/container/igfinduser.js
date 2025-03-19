import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../../utils/apiService';
import Loading from 'react-fullscreen-loading';
import { Link } from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import config from '../../utils/config';

class IgFindUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataUser: {},
            loadingDashboard: false,
            platforms: [
            ],
            period: [
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
            depth: 1,
            offset: 0,
            tmpReq: {},
            quickSearchData: [],
            loadingQuickSearch: false,
            loadingOnload: false,
            defaultValue: {},
            images: ""
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
            if(this.state.dataUser.plan_id === config.DEFAULT_PLAN){
                this._goto("/upgrade");
            }else{
                if(this.state.dataUser.is_active === '0'){
                    toast.warning("Please verify your email first, Thank You");
                    this._goto("/profile");
                }
                let tmpDataList = reactLocalStorage.get('tmpData-igfinduser');
                if (tmpDataList) {
                    this.setState({ data: JSON.parse(tmpDataList), showData: JSON.parse(tmpDataList) }, () => {
                    });
                }
                let tmpReq = reactLocalStorage.get('tmpReq-igfinduser');
                if (tmpReq) {
                    let parsed = JSON.parse(tmpReq);
                    this.setState({ tmpReq: parsed, keyword: parsed.keyword }, () => {
                    });
                }
                this._getQuickSearch();
            }
            
        });
    }

    _goto(v, param) {
        this.props.history.push(v, param, "_blank");
    }

    _getQuickSearch() {
        let tmpRequest = {
            'id_user': this.state.dataUser.id_user,
            'platform_quick': 'ig-finduser'
        };
        this._showLoadingQuickSearch();
        apiService.invoke("GET_QUICK_SEARCH", tmpRequest,
            (success) => {
                this._hideLoadingQuickSearch();
                if (success.code === '200') {
                    this.setState({ quickSearchData: success.data.reverse() });
                }
            }, (error) => {
                this._hideLoadingQuickSearch();
            });
    }

    _deleteQuickSearch = (id, content) => {
        let tmpRequest = {
            'id_quick': id
        };
        this._showLoading();

        apiService.invoke("DELETE_QUICK_SEARCH", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    this._getQuickSearch();
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoading();
            });
    }


    _getInstagramUser = (loading) => {
        reactLocalStorage.remove('tmpData-igfinduser');
        reactLocalStorage.remove('tmpReq-igfinduser');
        if (this.state.keyword === '') {
            this.setState({ emptyKeyword: true })
        } else {
            this.setState({ data: [] }, () => {
                let tmpRequest = {
                    'keyword': this.state.keyword.trim(),
                    'user_id': this.state.dataUser.id_user
                };
                if (loading) {
                    this._showLoading2();
                    this._showLoading();
                }
                apiService.invoke("SEARCH_INSTAGRAM_USER", tmpRequest,
                    (success) => {
                        this._hideLoading2();
                        this._hideLoading();
                        // let final = [];
                        if (success.code === '200') {
                            let dataResponse = JSON.parse(success.data);
                            if (dataResponse.status === 'fail') {
                                toast.error("User " + tmpRequest.keyword + " not found!");
                            } else {
                                let final = [];
                                let datas = dataResponse;
                                for (let index = 0; index < datas.length; index++) {
                                    final.push(datas[index].user);
                                }
                                console.log("list : ", final);
                                this.setState({ data: final, showData: final, images: success.image }, () => {
                                    reactLocalStorage.set("tmpData-igfinduser", JSON.stringify(final));
                                    reactLocalStorage.set("tmpReq-igfinduser", JSON.stringify(tmpRequest));
                                    this._getQuickSearch();
                                });
                            }
                        }else if (success.code === '302') {
                            toast.warning("Your instagram search has reached limit, please upgrade plan");
                            this._goto("/upgrade");
                        } else if (success.code === '303') {
                            toast.warning("Your plan has expired, please upgrade plan");
                            this._goto("/upgrade");
                        }
                    }, (error) => {
                        toast.error("Something went wrong, please reload page!");
                        this._hideLoading2();
                        this._hideLoading();
                    });
            });
        }
    }

    _showLoading() {
        this.setState({ loadingDashboard: true })
    }
    _hideLoading() {
        this.setState({ loadingDashboard: false })
    }

    _showLoadingQuickSearch() {
        this.setState({ loadingQuickSearch: true });
    }

    _hideLoadingQuickSearch() {
        this.setState({ loadingQuickSearch: false });
    }

    _showLoading2() {
        this.setState({ loading: true })
    }
    _hideLoading2() {
        this.setState({ loading: false })
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

    _renderInstagramCard = (dat) => {
        return (
            <>
                <div className='col-6 col-md-4 col-lg-3'>
                    <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <center>
                                 <img alt="" src={require('../../assets/images/instagram.png')} width={100} />
                            </center>
                        </div>
                        <div className='text-black'>
                            <center>
                                <img crossOrigin="anonymous" alt="user" src={dat.base64_pic ? dat.base64_pic : require('../../assets/images/tiktokuser.jpeg')} width={100} style={{ borderRadius: 50, marginTop: 10 }} />
                                <div className='mt-3 pl-3 pr-3 pb-2'>
                                    <h4><Link title={dat.full_name} onClick={() => this._goto('/iguser', { 'username': dat.username })}>{dat.full_name}</Link></h4>
                                    <div className='text-primary'>
                                        <p><i className='mdi mdi-instagram'></i> {dat.username}  {
                                        dat.is_verified ? (
                                            <img alt="verified" src={require("../../assets/images/ig-badge.png")} width={20} />
                                        ) : null
                                    }</p>
                                    </div>
                                </div>
                            </center>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this._getInstagramUser(true);
        }
    }

    _handleQuickSearch(usernames) {
        this.setState({ keyword: usernames }, () => {
            this._getInstagramUser(true);
        });
    }

    render() {
        const { loading, loadingDashboard, emptyKeyword, quickSearchData, loadingQuickSearch, showData } = this.state;
        return (
            <div >
                <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <div className='row justify-content-center'>
                    <div className='col-md-12 mb-3'>
                        <div className="card" style={{ boxShadow: '5px 5px 5px lightblue' }}>
                            <div className='card-header pb-0'>
                                <h5 className='text-primary'>Quick Search</h5>
                            </div>
                            <div className='card-body pb-0'>
                                {
                                    loadingQuickSearch ? (
                                        <div className='row pb-3'>
                                            <div className='col-3 col-md-3 col-xl-1'>
                                                <center>
                                                    <Skeleton height={50} width={50} borderRadius={20} />
                                                    <Skeleton height={10} width={50} borderRadius={5} />
                                                </center>
                                            </div>
                                            <div className='col-3 col-md-3 col-xl-1'>
                                                <center>
                                                    <Skeleton height={50} width={50} borderRadius={20} />
                                                    <Skeleton height={10} width={50} borderRadius={5} />
                                                </center>
                                            </div>
                                            <div className='col-3 col-md-3 col-xl-1'>
                                                <center>
                                                    <Skeleton height={50} width={50} borderRadius={20} />
                                                    <Skeleton height={10} width={50} borderRadius={5} />
                                                </center>
                                            </div>
                                            <div className='col-3 col-md-3 col-xl-1'>
                                                <center>
                                                    <Skeleton height={50} width={50} borderRadius={20} />
                                                    <Skeleton height={10} width={50} borderRadius={5} />
                                                </center>
                                            </div>
                                            <div className='col-3 col-md-3 col-xl-1'>
                                                <center>
                                                    <Skeleton height={50} width={50} borderRadius={20} />
                                                    <Skeleton height={10} width={50} borderRadius={5} />
                                                </center>
                                            </div>
                                        </div>
                                    ) : quickSearchData.length > 0 ? (
                                        <div className='row'>
                                            {
                                                quickSearchData.map((dat) => {
                                                    return (
                                                        <div className='col-3 col-md-3 col-xl-1'>
                                                            <center>
                                                                <Link title="Delete" onClick={() => this._deleteQuickSearch(dat.id_quick)}>
                                                                    <div style={{ backgroundColor: "#ccc", fontSize: 10, color: "#fff", fontWeight: "bold", padding: 3, height: 20, width: 20, borderRadius: 50, position: "absolute", marginTop: -9, marginLeft: 50 }}>
                                                                        <i className='fa fa-close'></i>
                                                                    </div>
                                                                </Link>
                                                                <img alt="user" src={require('../../assets/images/magnify.png')} width={50} className='' style={{ borderRadius: 25 }} />
                                                                <Link title={dat.value_quick} onClick={() => this._handleQuickSearch(dat.value_quick, dat.region_quick)}>
                                                                    <p className='text-primary mt-2' style={{ fontSize: 12 }}>{dat.value_quick.substring(0, 20) + '..'}</p>
                                                                </Link>
                                                            </center>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    ) : (
                                        <p className='text-primary' style={{ marginTop: -14 }}>There's no quick search, search user content below</p>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mb-3">
                        <div className="card">
                            <div className='row p-3 pr-4'>
                                <div className="col mb-2">
                                    <div className="input-group">
                                        <div className="input-group-append">
                                            <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                @
                                            </div>
                                        </div>
                                        <input onKeyDown={(e) => this._handleKeyDown(e)} onChangeCapture={(evt) => this._onChangeKeyword(evt)} type="text" placeholder="Keyword..." className={emptyKeyword ? "form-control border-danger" : "form-control"} value={this.state.keyword} />
                                    </div>
                                    {
                                        emptyKeyword ? (
                                            <label style={{ color: "red", fontSize: 14, marginTop: 10 }}>Keyword required!</label>
                                        ) : null
                                    }
                                </div>
                                <div className='col-auto mb-2'>
                                    <button style={{ height: 40 }} onClick={() => this._getInstagramUser(true)} className='btn btn-primary w-100'>
                                        <span className='mdi mdi-magnify'></span>
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
                                            <h4 className='mt-3'>Searching...</h4>
                                        </center>
                                    </div>
                                </div>
                            </div>
                        ) : showData.length > 0 ? showData.map((dat) => {
                            return (
                                this._renderInstagramCard(dat)
                            )
                        })
                            : (
                                <div className='col-md-12'>
                                    <div className='card'>
                                        <div className='card-body text-primary'>
                                            <div style={{ marginTop: '3%', marginBottom: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <center>
                                                    <img alt="notfound" src={require('../../assets/images/search.png')} width={300} />
                                                    <h2>There's nothing here<br></br><center><p className='mt-2'>Search the User by filling username above.</p></center></h2>
                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>
        );
    }
}

export default IgFindUser;
