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
import { TagsInput } from "react-tag-input-component";

class TiktokSearch extends Component {

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
            days: "7",
            keyword: "",
            showData: [],
            data: [],
            emptyKeyword: false,
            emptyCountry: false,
            country: "",
            sorts: "most",
            cursors: 12,
            loading: false,
            offset: 12,
            hasMore: 0,
            tmpReq: {},
            loadingOnload: false,
            labelPeriod: "Current Week",
            maxCursor: 12,
            defaultValue: {
                label: "All Country",
                value: ""
            },
            tags: [],
            valueTags: ""
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
            let tmpDataList = reactLocalStorage.get('tmpData-tiktoksearch');
            if (tmpDataList) {
                this.setState({ data: JSON.parse(tmpDataList), showData: JSON.parse(tmpDataList) }, () => {
                    this._onChangeSort({ target: { value: this.state.sorts } });
                });
            }
            let tmpReq = reactLocalStorage.get('tmpReq-tiktoksearch');
            console.log("tmpreq session : ", tmpReq);
            if (tmpReq) {
                let parsed = JSON.parse(tmpReq);
                this.setState({
                    tmpReq: parsed, keyword: parsed.keyword, country: parsed.country,
                    hasMore: parsed.has_more, maxCursor: parsed.offset ? parsed.offset : 0
                }, () => {
                    this._generateTagsList(parsed.keyword);
                    this._generateRegion(parsed.country);
                });
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
        if (distanceFromBottom === 0) {
            if (this.state.data.length > 0) {
                if (!this.state.loadingOnload) {
                    this._onLoad(true);
                }
            }
        }
    };

    _generateRegion(code) {
        let list = common.listCountry();
        for (let index = 0; index < list.length; index++) {
            if (list[index].value === code) {
                let obj = {
                    label: list[index].label,
                    value: list[index].value
                }
                this.setState({ defaultValue: obj }, () => {
                });

            }
        }
    }

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
        reactLocalStorage.remove('tmpData-tiktoksearch');
        if (this.state.valueTags === '') {
            this.setState({ emptyKeyword: true })
        } else {
            this.setState({ data: [] }, () => {
                let tmpRequest = {
                    'cursor': this.state.cursors,
                    "country": this.state.country,
                    "sort_type": this.state.sorts,
                    "publish_time": this.state.days,
                    "keyword": this.state.valueTags,
                    'offset': this.state.maxCursor,
                    "user_id": this.state.dataUser.id_user
                };
                if (loading) {
                    this._showLoading2();
                    this._showLoading();
                }
                console.log("tmp req : ", tmpRequest);
                apiService.invoke("GET_TIKTOK_VIDEO_SEARCH", tmpRequest,
                    (success) => {
                        this._hideLoading2();
                        this._hideLoading();
                        let final = [];
                        if (success.code === '200') {
                            // if (success.data.data) {
                            let dataResponse = JSON.parse(success.data);
                            let dataPost = dataResponse.search_item_list !== null ? dataResponse.search_item_list : false;
                            console.log("video : ", dataResponse);
                            if (dataPost) {
                                for (let index = 0; index < dataPost.length; index++) {
                                    let obj = {
                                        id: dataPost[index].aweme_info.aweme_id,
                                        platform: "tiktok",
                                        url: dataPost[index].aweme_info.video.download_addr.url_list[2],
                                        title: dataPost[index].aweme_info.desc,
                                        comment_count: dataPost[index].aweme_info.statistics.comment_count,
                                        like_count: dataPost[index].aweme_info.statistics.digg_count,
                                        share_count: dataPost[index].aweme_info.statistics.share_count,
                                        play_count: dataPost[index].aweme_info.statistics.play_count,
                                        nickname: dataPost[index].aweme_info.author.nickname,
                                        unique_id: dataPost[index].aweme_info.author.unique_id,
                                        region: dataPost[index].aweme_info.region,
                                        source: dataPost[index].aweme_info.share_info.share_url,
                                        cover_url: dataPost[index].aweme_info.video.cover.url_list[0]
                                    };
                                    if (tmpRequest.country !== '') {
                                        if (dataPost[index].aweme_info.region === tmpRequest.country) {
                                            final.push(obj);
                                        }
                                    } else {
                                        final.push(obj);
                                    }
                                }
                                this.setState({ showData: final, data: final, cursors: tmpRequest.cursor, offset: tmpRequest.offset, tmpReq: tmpRequest, hasMore: dataResponse.has_more, maxCursor: dataResponse.cursor ? dataResponse.cursor : 0 }, () => {
                                    let tmpDataList = final;
                                    tmpRequest['offset'] = dataResponse.cursor;
                                    tmpRequest['has_more'] = this.state.hasMore;
                                    reactLocalStorage.set('tmpData-tiktoksearch', JSON.stringify(tmpDataList));
                                    reactLocalStorage.set('tmpReq-tiktoksearch', JSON.stringify(tmpRequest));
                                });
                                if (this.state.sorts !== '') {
                                    this._onChangeSort({ target: { value: this.state.sorts } });
                                }
                            } else {
                                this.setState({ showData: [], data: [], hasMore: 0, maxCursor: 0 }, () => {
                                    let tmpDataList = [];
                                    reactLocalStorage.set('tmpData-tiktoksearch', JSON.stringify(tmpDataList));
                                    reactLocalStorage.set('tmpReq-tiktoksearch', JSON.stringify(tmpRequest));
                                    toast.warning("There's no content for keyword " + tmpRequest.keyword + ' in the ' + this.state.labelPeriod);
                                });
                            }

                            // } else {
                            //     this._hideLoading();
                            // }
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

    }

    _onLoad = (loading) => {
        if (this.state.valueTags === '') {
            this.setState({ emptyKeyword: true })
        } else {
            let tmpRequest = {};
            let tmpDataList = reactLocalStorage.get('tmpData-tiktoksearch');
            console.log("tmpDataList : ", tmpDataList);
            if (tmpDataList) {
                tmpRequest = this.state.tmpReq
            } else {
                tmpRequest = {
                    'cursor': parseInt(this.state.offset) + 1,
                    'keyword': this.state.valueTags,
                    "country": this.state.country,
                    "publish_time": this.state.days,
                    "sort_type": this.state.sorts,
                    'offset': this.state.maxCursor,
                    "user_id": this.state.dataUser.id_user
                };
            }
            console.log("tmpRequest : ", tmpRequest);

            if (loading) {
                this._showLoadingOnload();
            }
            apiService.invoke("GET_TIKTOK_VIDEO_SEARCH", tmpRequest,
                (success) => {
                    this._hideLoadingOnload();
                    let final = this.state.data;
                    if (success.code === '200') {
                        // if (success.data.data) {
                        let dataResponse = JSON.parse(success.data);
                        let dataPost = dataResponse.search_item_list !== null ? dataResponse.search_item_list : false;
                        console.log("video : ", dataPost);
                        if (dataPost) {
                            for (let index = 0; index < dataPost.length; index++) {
                                let obj = {
                                    id: dataPost[index].aweme_info.aweme_id,
                                    platform: "tiktok",
                                    url: dataPost[index].aweme_info.video.download_addr.url_list[2],
                                    title: dataPost[index].aweme_info.desc,
                                    comment_count: dataPost[index].aweme_info.statistics.comment_count,
                                    like_count: dataPost[index].aweme_info.statistics.digg_count,
                                    share_count: dataPost[index].aweme_info.statistics.share_count,
                                    play_count: dataPost[index].aweme_info.statistics.play_count,
                                    nickname: dataPost[index].aweme_info.author.nickname,
                                    unique_id: dataPost[index].aweme_info.author.unique_id,
                                    region: dataPost[index].aweme_info.region,
                                    source: dataPost[index].aweme_info.share_info.share_url,
                                    cover_url: dataPost[index].aweme_info.video.cover.url_list[0]

                                };
                                if (tmpRequest.country !== '') {
                                    if (dataPost[index].aweme_info.region === tmpRequest.country) {
                                        final.push(obj);
                                    }
                                } else {
                                    final.push(obj);
                                }
                            }
                            let theFinal = common.removeDuplicates(final, 'id');
                            this.setState({ showData: theFinal, data: theFinal, cursors: tmpRequest.cursor, offset: tmpRequest.offset, hasMore: dataResponse.has_more }, () => {
                                let tmpDataList = theFinal;
                                tmpRequest['offset'] = dataResponse.cursor;
                                tmpRequest['has_more'] = this.state.hasMore;
                                reactLocalStorage.set('tmpData-tiktoksearch', JSON.stringify(tmpDataList));
                                reactLocalStorage.set('tmpReq-tiktoksearch', JSON.stringify(tmpRequest));
                            });
                            if (this.state.sorts !== '') {
                                this._onChangeSort({ target: { value: this.state.sorts } });
                            }
                        } else {
                            toast.warning("No more videos found!");
                        }

                        // } else {
                        //     this._hideLoading();
                        // }
                    } else if (success.code === '302') {
                        toast.warning("Your tiktok search has reached limit, please upgrade plan");
                        this._goto("/upgrade");
                    } else if (success.code === '303') {
                        toast.warning("Your plan has expired, please upgrade plan");
                        this._goto("/upgrade");
                    }
                }, (error) => {
                    toast.error("Something went wrong, please reload page!");
                    this._hideLoadingOnload();
                });
        }
    }

    _onChangeSort(evt) {
        let value = evt.target.value;
        this.setState({
            sorts: value
        }, () => {
            let data = this.state.data;
            if (data.length > 0) {
                if (value !== '1') {
                    let filter = [];
                    if (value === 'comments') {
                        filter = data.sort(
                            (p1, p2) => (p1.comment_count < p2.comment_count) ? 1 : (p1.comment_count > p2.comment_count) ? -1 : 0);
                    } else if (value === 'shares') {
                        filter = data.sort(
                            (p1, p2) => (p1.share_count < p2.share_count) ? 1 : (p1.share_count > p2.share_count) ? -1 : 0);
                    } else if (value === 'most' || value === '0') {
                        filter = data.sort(
                            (p1, p2) => (p1.play_count < p2.play_count) ? 1 : (p1.play_count > p2.play_count) ? -1 : 0);
                    }
                    this.setState({ showData: filter });
                }
            }
        });
    }

    _showLoadingOnload() {
        this.setState({ loadingOnload: true })
    }
    _hideLoadingOnload() {
        this.setState({ loadingOnload: false })
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


    _comingSoon() {
        toast.warning("This feature is still under development, Stay Tuned!");
    }

    _onChangeKeyword(evt) {
        let value = evt.target.value;
        this.setState({ keyword: value, emptyKeyword: false });
    }

    _onChangePeriod(evt) {
        let value = evt.target.value;
        let period = this.state.period;
        let label = '';
        for (let index = 0; index < period.length; index++) {
            if (period[index].value === value) {
                label = period[index].label
            }
        }
        console.log("label : ", label);
        this.setState({ days: value, labelPeriod: label });
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
            <div className='card card-shadow mb-3' >
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
                    {/* <Link onClick={() => this._goto('detail', dat)}>
                        <div className="tiktokCover">
                            <img width={'100%'} src={dat.cover_url ? dat.cover_url : require("../../assets/images/tiktoknocover.png")} alt="" />
                            <Link onClick={() => this._goto('detail', dat)} className="btn">
                                <i className='mdi mdi-play-circle fa-3x'></i>
                            </Link>
                        </div>
                    </Link> */}
                    <video controls controlsList="nodownload" src={dat.url} style={{ height: 200 }} className='w-100'>
                    </video>
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
                    >
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
                    >
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
                    >
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
                    >
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

    _generateTagsList(val) {
        const stringWithSpaceDelimiter = val;
        const arrayOfStrings = stringWithSpaceDelimiter.split(',');
        this.setState({ tags: arrayOfStrings, valueTags: val });
    }

    _onChangeTags(val) {
        const concatenatedString = val.join(',');
        this.setState({
            tags: val,
            valueTags: concatenatedString,
            emptyKeyword: false
        }, () => {
            console.log("hasil : ", this.state.valueTags);
        });
    }

    render() {
        const { showData, loading, loadingDashboard, emptyKeyword, emptyCountry, loadingOnload, tags } = this.state;
        return (
            <div >
                <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <div className='row justify-content-center'>
                    <div className="col-md-12 mb-3">
                        <div className="card">
                            <div className='row p-3 pr-4'>
                                <div className="col-6 col-md-4 mb-3">
                                    {/* <div className="input-group">
                                        <div className="input-group-append">
                                            <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                <span className='mdi mdi-magnify'></span>
                                            </div>
                                        </div>
                                        <input onKeyDown={(e) => this._handleKeyDown(e)} onChangeCapture={(evt) => this._onChangeKeyword(evt)} type="text" placeholder="search..." className={emptyKeyword ? "form-control border-danger" : "form-control"} value={this.state.keyword} />
                                        
                                    </div> */}
                                    <div style={{ color: "black" }}>
                                        <TagsInput
                                            value={tags}
                                            onChange={(val) => this._onChangeTags(val)}
                                            name="search"
                                            placeHolder="Enter Keywords..."
                                            separators={["Enter"]}
                                        />
                                    </div>
                                    {
                                        emptyKeyword ? (
                                            <label style={{ color: "red", fontSize: 14, marginTop: 10 }}>search required! <br />Press Key "Enter" or "Space" to input the tag</label>
                                        ) : null
                                    }
                                </div>
                                <div className="col-6 col-md-3 mb-3">
                                    <Select
                                        ref={this.selectNasabah}
                                        placeholder={"Choose Country..."}
                                        onChange={(val) => this.setState({ country: val.value, emptyCountry: false, defaultValue: val })}
                                        styles={{
                                            option: (base) => ({
                                                ...base,
                                                height: '100%',
                                                color: "#000",
                                            }),
                                        }}
                                        options={common.listCountry()}
                                        value={this.state.defaultValue}
                                    />
                                    {
                                        emptyCountry ? (
                                            <label style={{ color: "red", fontSize: 14, marginTop: 10 }}>Region/Country required!</label>
                                        ) : null
                                    }
                                </div>
                                <div className="col-6 col-md-2 mb-3">
                                    <select onChangeCapture={(evt) => this._onChangePeriod(evt)} className='form-control border-gray'>
                                        <option disabled>- Period -</option>
                                        {
                                            this.state.period.map((data) => {
                                                return (
                                                    <option value={data.value}>{data.label}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-6 col-md-2 mb-3">
                                    <select onChangeCapture={(evt) => this._onChangeSort(evt)} className='form-control border-gray'>
                                        <option disabled>- Sort By -</option>
                                        <option value="0" selected>Most Relevance</option>
                                        <option value="1">Like Count</option>
                                        <option value="comments">Comment Count</option>
                                        <option value="shares">Share Count</option>
                                    </select>
                                </div>
                                <div className='col-12 col-md-1 mb-3'>
                                    <button style={{ height: 40 }} onClick={() => this._getTiktokVideo(true)} className='btn btn-primary w-100'>
                                        <span className='mdi mdi-magnify'></span>
                                    </button>
                                </div>
                                <div className='col-12'>
                                    <div className='alert alert-info'>
                                        <p>Note : Please search for keywords in the language of the country you've entered. If you select a country, you will get a more precise search, but with less content
                                        </p>
                                    </div>
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
                                <div className='col-6 col-md-6 col-lg-3'>
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
                    loadingOnload === false && showData.length > 0 && loading === false && this.state.hasMore === 1 ? (
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

export default TiktokSearch;
