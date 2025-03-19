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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import _debounce from 'lodash/debounce';

class Tiktok extends Component {

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
            keyword: "Trending",
            showData: [],
            data: [],
            emptyKeyword: false,
            country: "",
            sorts: "1",
            cursors: 12,
            loading: false,
            tmpReq: {},
            loadingOnload: false,
            defaultValue:{}
        }
        this.debouncedHandleScroll = _debounce(this.handleScroll, 500);

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
            let tmpDataList = reactLocalStorage.get('tmpData-recommended');
            if (tmpDataList) {
                this.setState({ data: JSON.parse(tmpDataList), showData: JSON.parse(tmpDataList) }, () => {
                    let tmpReq = reactLocalStorage.get('tmpReq-recommended');
                    if (tmpReq) {
                        let tmpReqs = JSON.parse(tmpReq);
                        this.setState({ country: tmpReqs.country });
                    }
                })
            }
        });
        window.addEventListener('scroll', this.debouncedHandleScroll);
    }

    componentWillUnmount() {
        window.addEventListener('scroll', this.debouncedHandleScroll);
    }

    handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY;
        const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
        if(distanceFromBottom === 0){
            if(this.state.data.length > 0){
                if(!this.state.loadingOnload){
                    this._onLoad(true);
                }
            }
        }
    };


    _goto(v, param) {
        this.props.history.push(v, param, "_blank");
    }


    _saveContent = (id, content) => {
        let tmpRequest = {
            'id_user': this.state.dataUser.id_user,
            "saved_content": JSON.stringify(content),
            'id_content': id
        };
        this._showLoading();

        apiService.invoke("SAVE_USER_CONTENT", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '201') {
                    console.log("hasil : ", success);
                    toast.success("Succesfully Saved Content!");
                } else if (success.code === '501') {
                    toast.warning("You already saved this content!");
                } else if (success.code === '302') {
                    toast.warning("Your save count has reached limit, please upgrade plan");
                    this._goto("/upgrade");
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoading();
            });


    }

    _getTiktokVideo = (loading) => {
        reactLocalStorage.remove('tmpData-recommended');
        this.setState({ data: [] }, () => {
            let tmpRequest = {
                'cursor': this.state.cursors,
                "country": this.state.country,
                "user_id": this.state.dataUser.id_user
            };
            if (loading) {
                this._showLoading2();
                this._showLoading();
            }
            apiService.invoke("GET_TIKTOK_VIDEO_RECOMMENDED", tmpRequest,
                (success) => {
                    this._hideLoading2();
                    this._hideLoading();
                    let final = [];
                    if (success.code === '200') {
                        let dataResponse = JSON.parse(success.data);
                        let dataPost = dataResponse.aweme_list !== null ? dataResponse.aweme_list : false;
                        if (dataPost) {
                            for (let index = 0; index < dataPost.length; index++) {
                                let obj = {
                                    id: dataPost[index].aweme_id,
                                    platform: "tiktok",
                                    url: dataPost[index].video.download_addr.url_list[2],
                                    title: dataPost[index].desc,
                                    comment_count: dataPost[index].statistics.comment_count,
                                    like_count: dataPost[index].statistics.digg_count,
                                    share_count: dataPost[index].statistics.share_count,
                                    play_count: dataPost[index].statistics.play_count,
                                    nickname: dataPost[index].author.nickname,
                                    unique_id: dataPost[index].author.unique_id,
                                    region: dataPost[index].region,
                                    source: dataPost[index].share_info.share_url,
                                    cover_url: dataPost[index].video.cover.url_list[0]

                                };
                                final.push(obj);
                            }
                            this.setState({ showData: final, data: final, cursors: tmpRequest.cursor }, () => {
                                let tmpDataList = final;
                                reactLocalStorage.set('tmpData-recommended', JSON.stringify(tmpDataList));
                                reactLocalStorage.set('tmpReq-recommended', JSON.stringify(tmpRequest));
                            });
                        } else {
                            toast.error("Something went wrong, please try again later!");
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

    _onLoad(loading) {
        let tmpRequest = {
            'cursor': 20,
            "country": this.state.country,
            "user_id": this.state.dataUser.id_user
        }
        if (loading) {
            this._showLoadingOnload();
        }
        apiService.invoke("GET_TIKTOK_VIDEO_RECOMMENDED", tmpRequest,
            (success) => {
                this._hideLoadingOnload();
                let final = this.state.data;
                if (success.code === '200') {
                    let dataResponse = JSON.parse(success.data);
                    let dataPost = dataResponse.aweme_list !== null ? dataResponse.aweme_list : false;
                    console.log("video : ", dataPost);
                    if (dataPost) {
                        for (let index = 0; index < dataPost.length; index++) {
                            let obj = {
                                id: dataPost[index].aweme_id,
                                platform: "tiktok",
                                url: dataPost[index].video.download_addr.url_list[2],
                                title: dataPost[index].desc,
                                comment_count: dataPost[index].statistics.comment_count,
                                like_count: dataPost[index].statistics.digg_count,
                                share_count: dataPost[index].statistics.share_count,
                                play_count: dataPost[index].statistics.play_count,
                                nickname: dataPost[index].author.nickname,
                                unique_id: dataPost[index].author.unique_id,
                                region: dataPost[index].region,
                                source: dataPost[index].share_info.share_url,
                                cover_url: dataPost[index].video.cover.url_list[0]
                            };
                            final.push(obj);
                        }
                        let theFinal = common.removeDuplicates(final, 'id');

                        this.setState({ showData: theFinal, data: theFinal, cursors: tmpRequest.cursor }, () => {
                            let tmpDataList = theFinal;
                            reactLocalStorage.set('tmpData-recommended', JSON.stringify(tmpDataList));
                            reactLocalStorage.set('tmpReq-recommended', JSON.stringify(tmpRequest));
                        });
                    } else {
                    }
                } else if (success.code === '302') {
                    toast.warning("Your tiktok search has reached limit, please upgrade plan");
                    this._goto("/upgrade");
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoadingOnload();
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
                    dat['transcripttext'] = hasil.text;
                    this._goto("/detail", dat);
                } else if (success.code === '302') {
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoading();
            });
    }

    _renderTiktokVideo = (dat) => {
        return (
            <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                <div className='card-header'>
                    <div className='row'>
                        <div className='col'>
                            <img alt="" src={require('../../assets/images/tiktok.png')} width={70} />
                        </div>
                        <div>
                            <Link title="Save" onClick={() => { this._saveContent(dat.id, dat) }}>
                                <img alt="" src={require("../../assets/images/unsave.png")} width={20} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='text-black'>
                <Link onClick={() => this._goto('detail', dat)}>
                        <div className="tiktokCover">
                        <img width={'100%'} src={dat.cover_url ? dat.cover_url : require("../../assets/images/tiktoknocover.png")} alt="" />
                            <Link onClick={() => this._goto('detail', dat)} className="btn">
                                <i className='mdi mdi-play-circle fa-3x'></i>
                            </Link>
                        </div>
                    </Link>
                    <div className='mt-3 pl-3 pr-3 pb-2'>
                        <h4><Link title={dat.title} onClick={() => this._goto('detail', dat)}>{dat.title.substring(0, 40) + '...'}</Link></h4>
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
                        <div className='col-3'>
                            <center>
                                <span><i className='mdi mdi-play-circle-outline fa-1x'></i></span>
                                <h4>{common.formatThousand(dat.play_count)}</h4>
                            </center>
                        </div>
                        <div className='col-3'>
                            <center>
                                <span><i className='mdi mdi-thumb-up-outline fa-1x'></i></span>
                                <h4>{common.formatThousand(dat.like_count)}</h4>
                            </center>
                        </div>
                        <div className='col-3'>
                            <center>
                                <span><i className='mdi mdi-comment-multiple-outline fa-1x'></i></span>
                                <h4>{common.formatThousand(dat.comment_count)}</h4>
                            </center>
                        </div>

                        <div className='col-3'>
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

    _renderLoadingCard = () => {
        return (
            <div className='row'>
                <div className='col-6 col-md-6 col-lg-3'>
                    <div className='card card-shadow'
                        style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col'>
                                    <Skeleton height={20} width={200} />
                                </div>
                            </div>
                        </div>
                        <div className='text-black'>
                            <div className='p-3'>
                                <Skeleton height={200} width={200} padding={10} />
                            </div>
                            <div className='mt-3 pl-3 pr-3 pb-2'>
                                <h4> <Skeleton height={20} width={100} /></h4>
                                <div className='row text-primary'>
                                    <div className='col'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                    <div className='col-auto'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer text-primary'>
                            <div className='row justify-content-center'>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className='col-6 col-md-6 col-lg-3'>
                    <div className='card card-shadow'
                        style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col'>
                                    <Skeleton height={20} width={200} />
                                </div>
                            </div>
                        </div>
                        <div className='text-black'>
                            <div className='p-3'>
                                <Skeleton height={200} width={200} padding={10} />
                            </div>
                            <div className='mt-3 pl-3 pr-3 pb-2'>
                                <h4> <Skeleton height={20} width={100} /></h4>
                                <div className='row text-primary'>
                                    <div className='col'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                    <div className='col-auto'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer text-primary'>
                            <div className='row justify-content-center'>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className='col-6 col-md-6 col-lg-3'>
                    <div className='card card-shadow'
                        style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col'>
                                    <Skeleton height={20} width={200} />
                                </div>
                            </div>
                        </div>
                        <div className='text-black'>
                            <div className='p-3'>
                                <Skeleton height={200} width={200} padding={10} />
                            </div>
                            <div className='mt-3 pl-3 pr-3 pb-2'>
                                <h4> <Skeleton height={20} width={100} /></h4>
                                <div className='row text-primary'>
                                    <div className='col'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                    <div className='col-auto'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer text-primary'>
                            <div className='row justify-content-center'>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className='col-6 col-md-6 col-lg-3'>
                    <div className='card card-shadow'
                        style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col'>
                                    <Skeleton height={20} width={200} />
                                </div>
                            </div>
                        </div>
                        <div className='text-black'>
                            <div className='p-3'>
                                <Skeleton height={200} width={200} padding={10} />
                            </div>
                            <div className='mt-3 pl-3 pr-3 pb-2'>
                                <h4> <Skeleton height={20} width={100} /></h4>
                                <div className='row text-primary'>
                                    <div className='col'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                    <div className='col-auto'>
                                        <p><Skeleton height={10} width={100} /></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer text-primary'>
                            <div className='row justify-content-center'>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                                <div className='col-md-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                            </div>
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
        const { showData, loading, loadingDashboard, loadingOnload } = this.state;
        return (
            <div onScroll={(e) => this._handleScrollDown(e)} >
                <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <div className='row justify-content-center'>
                    <div className="col-md-12 mb-3">
                        <div className="card">
                            <div className='row p-3 pr-4'>
                                <div className="col-md-6">
                                    <div className='alert alert-info'>
                                        <p>Choose country on the left first to shows what's <b>recommended</b> content on Tiktok on specific country.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <Select
                                        ref={this.selectNasabah}
                                        placeholder={"Choose Country/Region..."}
                                        onChange={(val) => this.setState({ country: val.value }, () => this._getTiktokVideo(true))}
                                        styles={{
                                            option: (base) => ({
                                                ...base,
                                                height: '100%',
                                                color: "#000",
                                            })
                                        }}
                                        options={common.listCountryWithoutAll()}
                                    />
                                </div>
                                {/* <div className='col-md-1 mb-2'>
                                    <button style={{ height: 40 }} onClick={() => this._getTiktokVideo(true)} className='btn btn-primary w-100'>
                                        <span className='mdi mdi-magnify'></span>
                                    </button>
                                </div> */}
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
                                <div className='col-6 col-md-6 col-lg-3'>
                                    {this._renderTiktokVideo(dat)}
                                </div>
                            )
                        }) : (
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
                {loadingOnload ? this._renderLoadingCard() : null}

                {
                    loadingOnload === false && showData.length > 0 && loading === false ? (
                        <center>
                            <div className='mt-2'>
                                <Link className="btn btn-primary" onClick={() => this._onLoad(true)}>Load More</Link>
                            </div>
                        </center>

                    ) : null
                }
            </div >
        );
    }
}

export default Tiktok;