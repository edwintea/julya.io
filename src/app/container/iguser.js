import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import common from '../../utils/common';
import config from '../../utils/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../../utils/apiService';
import Loading from 'react-fullscreen-loading';
import { Link } from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Lightbox } from "react-modal-image";
import { isMobile } from 'react-device-detect';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Stories from 'react-insta-stories';


class IgUser extends Component {
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
            showDataReels: [],
            data: [],
            emptyKeyword: false,
            emptyCountry: false,
            country: "",
            sorts: "",
            cursors: 0,
            loading: false,
            depth: 1,
            offset: 0,
            tmpReq: {},
            quickSearchData: [],
            loadingQuickSearch: false,
            loadingOnload: false,
            defaultValue: {},
            images: "",
            sourceImage: "",
            openImage: "",
            namaImage: "",
            listPost: [],
            listReels: [],
            loadingContent: false,
            loadingContentLoad: false,
            totalLikes: 0,
            averageLikes: 0,
            totalComments: 0,
            averageComments: 0,
            mostLikes: 0,
            mostComments: 0,
            minLikes: 0,
            minComments: 0,
            active: "posts",
            loadImage: false,
            listStory: [],
            showModal: false
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
            if (this.state.dataUser.plan_id === config.DEFAULT_PLAN) {
                this._goto("/upgrade");
            } else {
                if (this.state.dataUser.is_active === '0') {
                    toast.warning("Please verify your email first, Thank You");
                    this._goto("/profile");
                }
                let data = this.props.history.location.state;
                if (data) {
                    this.setState({ keyword: data.username }, () => {
                        this._getInstagramUser(true);
                    });
                } else {
                    let tmpDataList = reactLocalStorage.get('tmpData-iguser');
                    let tmpDataImage = reactLocalStorage.get('tmpData-iguserimage');
                    if (tmpDataList) {
                        this.setState({ data: JSON.parse(tmpDataList), showData: JSON.parse(tmpDataList), images: tmpDataImage }, () => {
                            console.log("tmpDataList", this.state.data);
                            this._getUserContent(this.state.data.id);
                            this._getUserStory(this.state.data.id);
                        });
                    }
                    let tmpReq = reactLocalStorage.get('tmpReq-iguser');
                    if (tmpReq) {
                        let parsed = JSON.parse(tmpReq);
                        this.setState({ tmpReq: parsed, keyword: parsed.keyword }, () => {
                        });
                    }
                }
            }

            this._getQuickSearch();
        });
    }

    _goto(v, param) {
        this.props.history.push(v, param);
    }

    _getQuickSearch() {
        let tmpRequest = {
            'id_user': this.state.dataUser.id_user,
            'platform_quick': 'ig-user'
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
        reactLocalStorage.remove('tmpData-iguser');
        reactLocalStorage.remove('tmpData-iguserimage');
        reactLocalStorage.remove('tmpReq-iguser');
        if (this.state.keyword === '') {
            this.setState({ emptyKeyword: true })
        } else {
            this.setState({
                active: "posts",
                data: [], showData: [], mostLikes: 0, mostComments: 0,
                minLikes: 0, minComments: 0,
                totalComments: 0, totalLikes: 0, listReels: [], showDataReels: [],
                listStory: [], showModal: false, listPost: [],
            }, () => {
                let tmpRequest = {
                    'keyword': this.state.keyword,
                    'user_id': this.state.dataUser.id_user
                };
                if (loading) {
                    this._showLoading2();
                    this._showLoading();
                }
                apiService.invoke("GET_INSTAGRAM_USER", tmpRequest,
                    (success) => {
                        this._hideLoading2();
                        this._hideLoading();
                        // let final = [];
                        if (success.code === '200') {
                            let dataResponse = JSON.parse(success.data);
                            if (dataResponse.status === 'fail') {
                                toast.error("User " + tmpRequest.keyword + " not found!");
                            } else {
                                console.log("iguser : ", dataResponse);
                                this.setState({ data: dataResponse.data, images: success.image }, () => {
                                    reactLocalStorage.set("tmpData-iguser", JSON.stringify(dataResponse.data));
                                    reactLocalStorage.set("tmpData-iguserimage", success.image);
                                    reactLocalStorage.set("tmpReq-iguser", JSON.stringify(tmpRequest));
                                    this._getQuickSearch();
                                    if (!dataResponse.data.is_private) {
                                        this._getUserContent(dataResponse.data.id);
                                        this._getUserStory(dataResponse.data.id);
                                    }
                                });
                            }
                        } else if (success.code === '302') {
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

    _getUserReels(userid) {
        console.log("userid : ", userid);
        this.setState({ listReels: [], showDataReels: [] }, () => {
            let tmpRequest = {
                'id_user': this.state.dataUser.id_user,
                'userid': userid,
                'cursor': this.state.cursors === 0 ? "" : this.state.cursors
            };
            this._showLoadingContent();
            apiService.invoke("SEARCH_INSTAGRAM_USER_REELS", tmpRequest,
                (success) => {
                    this._hideLoadingContent();
                    if (success.code === '200') {
                        let hasil = JSON.parse(success.data);
                        console.log("reels : ", hasil);
                        if (hasil.data.items.length > 0) {
                            let finals = [];
                            let hasils = hasil.data.items;
                            for (let index = 0; index < hasils.length; index++) {
                                finals.push(hasils[index].media);
                            }

                            let posts = hasils;
                            let totalLikes = this.state.totalLikes;
                            let totalComments = this.state.totalComments;

                            for (let index = 0; index < posts.length; index++) {
                                totalLikes += posts[index].media.like_count;
                                totalComments += posts[index].media.comment_count;
                            }

                            this.setState({ listReels: finals, showDataReels: finals, totalLikes: totalLikes, totalComments: totalComments }, () => {
                            });
                        } else {
                            if (this.state.data.is_private) {
                                toast.warning(this.state.data.username + ' Profile is Private');
                            }
                        }
                    } else if (success.code === '302') {
                        toast.warning("Your instagram search has reached limit, please upgrade plan");
                        this._goto("/upgrade");
                    }
                }, (error) => {
                    this._hideLoadingContent();
                });
        })

    }

    _getUserStory(userid) {
        console.log("userid : ", userid);
        let tmpRequest = {
            'id_user': this.state.dataUser.id_user,
            'userid': userid,
        };
        apiService.invoke("GET_INSTAGRAM_STORY", tmpRequest,
            (success) => {
                if (success.code === '200') {
                    let hasil = success.data.data;
                    let story = [];
                    if (hasil) {
                        for (let index = 0; index < hasil.length; index++) {
                            let obj = {};
                            if (hasil[index].video_versions) {
                                obj = {
                                    url: hasil[index].video_versions[0].url,
                                    type: 'video'
                                };
                            } else {
                                obj = {
                                    url: hasil[index].image_versions2.candidates[0].url,
                                    type: "image"
                                };
                            }
                            story.push(obj);
                        }
                    }

                    console.log("hasil : ", story);
                    this.setState({ listStory: story });
                }
            }, (error) => {
            });
    }

    _getUserContent(userid) {
        console.log("userid : ", userid);

        let tmpRequest = {
            'id_user': this.state.dataUser.id_user,
            'userid': userid,
            'cursor': this.state.cursors === 0 ? "" : this.state.cursors
        };
        this._showLoadingContent();
        apiService.invoke("SEARCH_INSTAGRAM_USER_CONTENT", tmpRequest,
            (success) => {
                this._hideLoadingContent();
                if (success.code === '200') {
                    let hasil = success.data;
                    if (hasil.length > 0) {
                        if (hasil[0].node.owner.username === this.state.data.username) {
                            let posts = hasil;
                            let finals = [];
                            let totalLikes = 0;
                            let totalComments = 0;
                            let mostLikes = 0;
                            let mostComments = 0;
                            let minLikes = 0;
                            let minComments = 0;
                            for (let index = 0; index < posts.length; index++) {
                                if (posts[index].node) {
                                    finals.push(posts[index].node);
                                }
                                totalLikes += posts[index].node.edge_media_preview_like.count;
                                totalComments += posts[index].node.edge_media_to_comment.count;
                            }
                            console.log("hasil : ", finals);
                            const listLikes = finals.map(object => {
                                return object.edge_media_preview_like.count;
                            });
                            const listComments = finals.map(object => {
                                return object.edge_media_to_comment.count;
                            });
                            mostLikes = Math.max(...listLikes);
                            mostComments = Math.max(...listComments);
                            minLikes = Math.min(...listComments);
                            minComments = Math.min(...listComments);

                            this.setState({
                                listPost: finals, totalLikes: totalLikes, totalComments: totalComments,
                                mostLikes: mostLikes, mostComments: mostComments, minLikes: minLikes, minComments: minComments
                            }, () => {
                                if (this.state.sorts !== '') {
                                    this._onChangeSort({ target: { value: this.state.sorts } });
                                } else {
                                    this.setState({ showData: finals });
                                }
                            });
                        }
                    } else {
                        if (this.state.data.is_private) {
                            toast.warning(this.state.data.username + ' Profile is Private');
                        } else {
                            this.onChangeTab('reels');
                        }
                    }
                } else if (success.code === '302') {
                    toast.warning("Your instagram search has reached limit, please upgrade plan");
                    this._goto("/upgrade");
                } else if (success.code === '303') {
                    toast.warning("Your plan has expired, please upgrade plan");
                    this._goto("/upgrade");
                }
            }, (error) => {
                this._hideLoadingContent();
            });

    }

    _onLoad(userid) {
        console.log("userid : ", userid);
        let tmpRequest = {
            'id_user': this.state.dataUser.id_user,
            'userid': userid,
            'cursor': this.state.cursors + 9
        };
        this._showLoadingLoad();
        apiService.invoke("SEARCH_INSTAGRAM_USER_CONTENT", tmpRequest,
            (success) => {
                this._hideLoadingLoad();
                if (success.code === '200') {
                    let hasil = JSON.parse(success.data);
                    if (hasil.data.edges.length > 0) {
                        let posts = hasil.data.edges;
                        let finals = this.state.listPost;
                        for (let index = 0; index < posts.length; index++) {
                            if (posts[index].node) {
                                finals.push(posts[index].node);
                            }
                        }

                        this.setState({ listPost: finals, cursors: tmpRequest.cursor });
                    } else {
                        if (this.state.data.is_private) {
                            toast.warning(this.state.data.username + ' Profile is Private');
                        }
                    }
                } else if (success.code === '302') {
                    toast.warning("Your instagram search has reached limit, please upgrade plan");
                    this._goto("/upgrade");
                } else if (success.code === '303') {
                    toast.warning("Your plan has expired, please upgrade plan");
                    this._goto("/upgrade");
                }
            }, (error) => {
                this._hideLoadingLoad();
            });
    }

    _showLoadingContent() {
        this.setState({ loadingContent: true })
    }
    _hideLoadingContent() {
        this.setState({ loadingContent: false })
    }

    _showLoading() {
        this.setState({ loadingDashboard: true })
    }
    _hideLoading() {
        this.setState({ loadingDashboard: false })
    }

    _showLoadingLoad() {
        this.setState({ loadingContentLoad: true })
    }
    _hideLoadingLoad() {
        this.setState({ loadingContentLoad: false })
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

    _onOpenImage(source, nama) {
        this.setState({ sourceImage: source, namaImage: nama }, () => {
            this.setState({ openImage: true })
        })
    }

    _showingImage(id, url) {
        if (this.state.loadImage === false) {
            this.setState({ loadImage: true }, () => {
                let listPost = this.state.listPost;
                let finals = [];
                for (let index = 0; index < listPost.length; index++) {
                    if (listPost[index].id === id) {
                        listPost[index].loading = true;
                    }
                    finals.push(listPost[index]);
                }
                this.setState({ showData: finals, listPost: finals }, () => {
                    let tmpRequest = {
                        'url': url
                    };
                    apiService.invoke("GET_IMAGE", tmpRequest,
                        (success) => {
                            this._hideLoadingLoad();
                            if (success.code === '200') {
                                let result = [];
                                let listPosts = this.state.listPost;
                                for (let index = 0; index < listPosts.length; index++) {
                                    if (listPosts[index].id === id) {
                                        listPosts[index].loading = false;
                                        listPosts[index].base64 = success.image;
                                    }
                                    result.push(listPosts[index]);
                                }
                                this.setState({ showData: result, listPost: result, loadImage: false }, () => {
                                    console.log("showdata : ", this.state.showData);
                                })
                            }
                        }, (error) => {
                        });
                });
            })
        }
    }


    _renderInstagramCard = (dat) => {
        return (
            <>
                <div className='col-6 col-md-6'>

                    <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col'>
                                    <img alt="" src={require('../../assets/images/instagram.png')} width={100} />
                                </div>
                                <div className='col-auto'>
                                    <a href={"https://instagram.com/" + dat.username} target='_blank' rel="noopener noreferrer" className='btn btn-primary'>
                                        <i className='mdi mdi-open-in-new'></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='text-black'>
                            <center>
                                {
                                    this.state.listStory.length > 0 ? (
                                        <div className="gradientIg" onClick={() => this.setState({ showModal: true })}>
                                            <img className='imageIg' crossOrigin="anonymous" alt="user" src={this.state.images} />
                                        </div>
                                    ) : (
                                        <Link onClick={() => this._onOpenImage(this.state.images, dat.full_name)}>
                                            <img crossOrigin="anonymous" alt="user" src={this.state.images} width={130} style={{ borderRadius: 80, marginTop: 20 }} />
                                        </Link>
                                    )
                                }

                            </center>
                            <div className='mt-3 pl-3 pr-3 pb-2'>
                                <h4><Link title={dat.full_name} onClick={() => this._goto('instagram_detail', dat)}>{dat.full_name} {
                                    dat.is_verified ? (
                                        <img alt="verified" src={require("../../assets/images/ig-badge.png")} width={25} />
                                    ) : null
                                }</Link></h4>
                                <div className='row text-primary'>
                                    <div className='col'>
                                        {dat.category_name ? (
                                            <p>
                                                <i className='mdi mdi-account'></i> {dat.category_name}
                                            </p>
                                        ) : null}
                                        <p> {dat.biography}</p>
                                        {
                                            dat.bio_links.length > 0 ? (
                                                <p><a href={dat.bio_links[0].url} target='_blank' rel="noopener noreferrer">{dat.bio_links[0].url}</a></p>
                                            ) : null
                                        }
                                    </div>
                                    <div className='col-auto'>
                                        <p><i className='mdi mdi-instagram'></i> {dat.username}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className='col-6 col-md-6'>
                    <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <center><h4 className='text-primary'><i className='mdi mdi-account'></i> Profile Status</h4></center>
                        </div>
                        <div className='card-body text-primary'>
                            <div className='row'>
                                <div className='col-4'>
                                    <center>
                                        <h3>{common.formatThousand(dat.edge_owner_to_timeline_media.count)}</h3>
                                        <p>Posts</p>
                                    </center>
                                </div>
                                <div className='col-4'>
                                    <center>
                                        <h3>{common.formatThousand(dat.edge_followed_by.count)}</h3>
                                        <p>Followers</p>
                                    </center>
                                </div>
                                <div className='col-4'>
                                    <center>
                                        <h3>{common.formatThousand(dat.edge_follow.count)}</h3>
                                        <p>Following</p>
                                    </center>
                                </div>
                                <div className='col-4'>
                                    <center>
                                        <h3><i className={this.state.data.is_private ? 'mdi mdi-eye-off-outline fa-2x' : 'mdi mdi-eye-outline fa-2x'}></i></h3>
                                        <p>{this.state.data.is_private ? 'Private' : 'Public'}</p>
                                    </center>
                                </div>
                                <div className='col-4'>
                                    <center>
                                        <h3><i className='mdi mdi-account-circle fa-2x'></i></h3>
                                        <p>{this.state.data.is_business_account ? 'Business' : this.state.data.is_professional_account ? 'Professional' : 'Personal'}</p>
                                    </center>
                                </div>
                                <div className='col-4'>
                                    <center>
                                        <h3>{this.state.data.is_verified ? <img alt="" src={require('../../assets/images/ig-badge.png')} width={60} /> : <i className='mdi mdi-minus fa-2x'></i>}</h3>
                                        <p>{this.state.data.is_verified ? 'Verified' : 'Not Verified'}</p>
                                    </center>
                                </div>
                            </div>
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

    _onChangeSort(evt) {
        let value = evt.target.value;
        this.setState({
            sorts: value
        }, () => {
            let data = this.state.listPost;
            let dataReels = this.state.listReels;
            if (data.length > 0) {
                if (value !== '1' && value !== '0') {
                    let filter = [];
                    let filterReels = [];
                    if (value === 'likes') {
                        filter = data.sort(
                            (p1, p2) => (p1.edge_media_preview_like.count < p2.edge_media_preview_like.count) ? 1 : (p1.edge_media_preview_like.count > p2.edge_media_preview_like.count) ? -1 : 0);

                        filterReels = dataReels.sort(
                            (p1, p2) => (p1.like_count < p2.like_count) ? 1 : (p1.like_count > p2.like_count) ? -1 : 0);
                    } else if (value === 'comments') {
                        filter = data.sort(
                            (p1, p2) => (p1.edge_media_to_comment.count < p2.edge_media_to_comment.count) ? 1 : (p1.edge_media_to_comment.count > p2.edge_media_to_comment.count) ? -1 : 0);

                        filterReels = dataReels.sort(
                            (p1, p2) => (p1.comment_count < p2.comment_count) ? 1 : (p1.comment_count > p2.comment_count) ? -1 : 0);
                    } else if (value === 'views') {
                        filterReels = dataReels.sort(
                            (p1, p2) => (p1.play_count < p2.play_count) ? 1 : (p1.play_count > p2.play_count) ? -1 : 0);
                    }
                    if (filterReels.length !== 0) {
                        this.setState({ showDataReels: filterReels });
                    }
                    if (filter.length !== 0) {
                        this.setState({ showData: filter });
                    }
                }
            }
        });
    }

    _getImage(url) {
        console.log("image : ", common.imageUrlToBase64(url));
    }

    _renderIgPost(dat) {
        return (
            <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                <div className='card-header pt-3'>
                    <div className='row text-primary'>
                        <div className='col'>
                            <div className='row'>
                                <div className='mr-2 ml-1'>
                                    <img crossOrigin='anonymous' alt="" src={this.state.images} width={40} style={{ borderRadius: 40 }} />
                                </div>
                                <div className=''>
                                    <h5>{this.state.data.username} {
                                        this.state.data.is_verified ? (
                                            <img alt="verified" src={require("../../assets/images/ig-badge.png")} width={20} />
                                        ) : null
                                    }</h5>
                                    <p style={{ marginTop: -7, marginBottom: -10 }}>{common.formatThousand(this.state.data.edge_followed_by?.count)} Followers</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <a href={"https://instagram.com/p/" + dat.shortcode} target='_blank' rel="noopener noreferrer" className='btn btn-primary'>
                                <i className='mdi mdi-open-in-new'></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='text-black'>
                    <center>
                        {
                            dat.base64 === '' ? dat.loading ? (
                                <div className='p-2'>
                                    <Skeleton height={300} width={'100%'} padding={10} />
                                </div>
                            ) : (
                                <div className='py-5' style={{ paddingBottom: 30 }}>
                                    <Link onClick={() => this._showingImage(dat.id, dat.display_url)} className={this.state.loadImage ? "text-gray" : "text-info"} disabled={this.state.loadImage}>
                                        <i className='mdi mdi-refresh fa-2x'></i>
                                    </Link>
                                </div>
                            ) : (
                                <Link onClick={() => this._onOpenImage(dat.base64, this.state.data.username)}>
                                    <img src={dat.base64} width={'100%'} alt="post" />
                                </Link>
                            )
                        }
                    </center>
                    <div className='mt-3 pl-3 pr-3 pb-2'>
                        <div className='row text-primary pl-2 pb-2'>
                            <div className='col'>
                                <div className='row'>
                                    <img alt="" className='mr-2' src={require("../../assets/images/ig-heart.png")} width={30} />
                                    <img alt="" className='mr-2' src={require("../../assets/images/ig-comment.png")} width={30} />
                                    <img alt="" className='mr-2' src={require("../../assets/images/ig-upload.png")} width={30} />
                                </div>
                            </div>
                            <div className='col-auto'>
                                <img alt="" src={require("../../assets/images/ig-save.png")} width={30} />
                            </div>
                        </div>
                        <div className='row text-primary'>
                            <div className='col'>
                                <h5>{parseInt(dat.edge_media_preview_like.count) < 0 ? '0' : common.formatThousand(dat.edge_media_preview_like.count)} Likes</h5>
                            </div>
                            <div className='col-auto'>
                                <p><i className='mdi mdi-instagram'></i> {dat.owner.username}</p>
                            </div>
                        </div>
                        <p className='text-justify'>
                            {dat.edge_media_to_caption.edges.length > 0 ? dat.edge_media_to_caption.edges[0].node.text.substring(400, 0) + '...' : null}
                        </p>
                    </div>
                </div>
                <div className='card-footer text-primary'>
                    <div className='row pl-1'>
                        <div className='col row'>
                            <div className='mr-2'>
                                <i className='mdi mdi-heart-outline'></i> {parseInt(dat.edge_media_preview_like.count) < 0 ? '0' : common.formatThousand(dat.edge_media_preview_like.count)}
                            </div>
                            <div className='mr-2'>
                                <i className='mdi mdi-comment-outline'></i> {common.formatThousand(dat.edge_media_to_comment.count)}
                            </div>
                        </div>
                        <div className='col-auto'>
                            {
                                dat.is_video ? (
                                    <>
                                        <i className='mdi mdi-eye-outline'></i> {common.formatThousand(dat.video_view_count)}
                                    </>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    _renderIgReels(dat) {
        return (
            <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                <div className='card-header pt-3'>
                    <div className='row text-primary'>
                        <div className='col'>
                            <div className='row'>
                                <div className='mr-2 ml-1'>
                                    <img alt="" src={this.state.images} width={40} style={{ borderRadius: 40 }} />
                                </div>
                                <div className=''>
                                    <h5>{this.state.data.username}</h5>
                                    <p style={{ marginTop: -7, marginBottom: -10 }}>{common.formatThousand(this.state.data.edge_followed_by?.count)} Followers</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <a href={"https://instagram.com/reel/" + dat.code} target='_blank' rel="noopener noreferrer" className='btn btn-primary'>
                                <i className='mdi mdi-open-in-new'></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='text-black'>
                    <center>
                        <video controls controlsList="nodownload" src={dat.video_versions[0].url} style={{ height: 200 }} className='w-100'>
                        </video>
                    </center>
                    <div className='mt-3 pl-3 pr-3 pb-2'>
                        <div className='row text-primary'>
                            <div className='col'>
                                <h5>{parseInt(dat.like_count) < 0 ? '0' : common.formatThousand(dat.like_count)} Likes</h5>
                            </div>
                            <div className='col-auto'>
                                <p><i className='mdi mdi-instagram'></i> {dat.user.username}</p>
                            </div>
                        </div>
                        <p className='text-justify'>
                            {dat.caption ? dat.caption.text.substring(400, 0) + '...' : null}
                        </p>
                    </div>
                </div>
                <div className='card-footer text-primary'>
                    <div className='row pl-1'>
                        <div className='col row'>
                            <div className='mr-2'>
                                <i className='mdi mdi-heart-outline'></i> {parseInt(dat.like_count) < 0 ? '0' : common.formatThousand(dat.like_count)}
                            </div>
                            <div className='mr-2'>
                                <i className='mdi mdi-comment-outline'></i> {common.formatThousand(dat.comment_count)}
                            </div>
                        </div>
                        <div className='col-auto'>
                            <>
                                <i className='mdi mdi-eye-outline'></i> {common.formatThousand(dat.play_count)}
                            </>

                        </div>
                    </div>
                </div>
            </div>
        )
    }


    _renderLoadingCard = () => {
        return (
            <>
                <div className='col-6 col-md-6 col-lg-4 mb-2'>
                    <div className='card card-shadow'
                        style={{ boxShadow: '5px 5px 5px lightblue' }}>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col'>
                                    <Skeleton height={20} width={'100%'} />
                                </div>
                            </div>
                        </div>
                        <div className='text-black'>
                            <div className='p-3'>
                                <Skeleton height={200} width={'100%'} padding={10} />
                            </div>
                            <div className='mt-3 pl-3 pr-3 pb-2'>
                                <h4> <Skeleton height={20} width={100} /></h4>
                                <div className='row text-primary'>
                                    <div className='col'>
                                        <p><Skeleton height={10} width={'100%'} /></p>
                                    </div>
                                    <div className='col-auto'>
                                        <p><Skeleton height={10} width={'100%'} /></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer text-primary'>
                            <div className='row justify-content-center'>
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className='col-6 col-md-6 col-lg-4 mb-2'>
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
                                <Skeleton height={200} width={'100%'} padding={10} />
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
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className='col-6 col-md-6 col-lg-4'>
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
                                <Skeleton height={200} width={'100%'} padding={10} />
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
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>
                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                                <div className='col-3'>
                                    <center>
                                        <h4><Skeleton height={20} width={40} /></h4>
                                    </center>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }

    onChangeTab(val) {
        this.setState({ active: val }, () => {
            if (val === 'posts') {
                if (this.state.showData.length === 0) {
                    this._getUserContent(this.state.data.id);
                }
            } else {
                if (this.state.showDataReels.length === 0) {
                    this._getUserReels(this.state.data.id);
                }

            }
        })
    }


    render() {
        const { loading, loadingDashboard, emptyKeyword, quickSearchData, loadingQuickSearch, data,
            loadingContent, showData, active, showDataReels } = this.state;
        return (
            <div >
                {
                    this.state.listStory.length > 0 ? (
                        <Popup open={this.state.showModal} closeOnEscape={true} closeOnDocumentClick={true} position="right center" contentStyle={{ backgroundColor: "transparent", borderColor: "transparent" }} onClose={() => this.setState({ showModal: false })}>
                            <div className='row justify-content-center'>
                                <div>
                                    <Stories
                                        stories={this.state.listStory}
                                        defaultInterval={3000}
                                        width={400}
                                        height={600}
                                    />
                                    <button style={{ borderRadius: 0 }} className='btn btn-primary w-100 font-weight-200' onClick={() => this.setState({ showModal: false })}>CLOSE</button>
                                </div>

                            </div>

                        </Popup>
                    ) : null
                }
                <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                {
                    this.state.openImage ? (
                        <Lightbox
                            medium={this.state.sourceImage}
                            large={this.state.sourceImage}
                            alt={this.state.namaImage}
                            onClose={() => this.setState({ openImage: false })}
                        />
                    ) : null
                }

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
                                                        <div className='col-3 col-xl-1'>
                                                            <center>
                                                                <Link title="Delete" onClick={() => this._deleteQuickSearch(dat.id_quick)}>
                                                                    <div style={{ backgroundColor: "#ccc", fontSize: 10, color: "#fff", fontWeight: "bold", padding: 3, height: 20, width: 20, borderRadius: 50, position: "absolute", marginTop: -9, marginLeft: 50 }}>
                                                                        <i className='fa fa-close'></i>
                                                                    </div>
                                                                </Link>
                                                                <img alt="user" src={dat.thumb_quick} width={60} className='' style={{ borderRadius: 30 }} />
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
                                        <input onKeyDown={(e) => this._handleKeyDown(e)} onChangeCapture={(evt) => this._onChangeKeyword(evt)} type="text" placeholder="Instagram Username..." className={emptyKeyword ? "form-control border-danger" : "form-control"} value={this.state.keyword} />
                                    </div>
                                    {
                                        emptyKeyword ? (
                                            <label style={{ color: "red", fontSize: 14, marginTop: 10 }}>Keyword required!</label>
                                        ) : null
                                    }
                                </div>

                                <div className='col-auto mb-2'>
                                    <button style={{ height: 40 }} onClick={() => this._getInstagramUser(true)} className='btn btn-primary w-100'>
                                        <span className='mdi mdi-magnify'></span> Search User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {
                        loading ? (
                            <div className='col-md-12 mb-3'>
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
                        ) : data.username ?
                            this._renderInstagramCard(data)
                            : (
                                <div className='col-md-12 mb-3'>
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
                {
                    loading ? null :
                        this.state.data.is_private ? null : (
                            <div className='row'>
                                <div className='col-12 col-md-12 col-lg-4'>
                                    <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                        <div className='card-header'>
                                            <center><h4 className='text-primary'><span className='mdi mdi-heart text-danger'></span> Likes</h4></center>
                                        </div>
                                        <div className='card-body text-primary'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.mostLikes)}</h3>
                                                        <p>Most</p>
                                                    </center>
                                                </div>
                                                <div className='col-4'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.minLikes)}</h3>
                                                        <p>Less</p>
                                                    </center>
                                                </div>
                                                <div className='col-4'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.totalLikes)}</h3>
                                                        <p>Total</p>
                                                    </center>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='col-12 col-md-6 col-lg-4'>
                                    <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                        <div className='card-header'>
                                            <center><h4 className='text-primary'><span className='mdi mdi-comment-multiple text-semi'></span> Comments</h4></center>
                                        </div>
                                        <div className='card-body text-primary'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.mostComments)}</h3>
                                                        <p>Most</p>
                                                    </center>
                                                </div>
                                                <div className='col-4'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.minLikes)}</h3>
                                                        <p>Less</p>
                                                    </center>
                                                </div>
                                                <div className='col-4'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.totalComments)}</h3>
                                                        <p>Total</p>
                                                    </center>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6 col-lg-4'>
                                    <div className='card card-shadow mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                        <div className='card-header'>
                                            <center><h4 className='text-primary'><span className='mdi mdi-image-album text-semi'></span> Contents</h4></center>
                                        </div>
                                        <div className='card-body text-primary'>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.listPost.length)}</h3>
                                                        <p>Post</p>
                                                    </center>
                                                </div>
                                                <div className='col-6'>
                                                    <center>
                                                        <h3>{common.formatThousand(this.state.listReels.length)}</h3>
                                                        <p>Reels</p>
                                                    </center>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                }
                <div className='row'>

                    <div className='col-md-12 mb-3'>
                        <div className='card' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className='col'>
                                        {
                                            isMobile ? (
                                                <select value={this.state.active} className='form-control border-gray' onChangeCapture={(val) => this.onChangeTab(val.target.value)}>
                                                    <option selected value="posts">Posts</option>
                                                    <option value="reels">Reels</option>
                                                </select>
                                            ) : (
                                                <>
                                                    <button onClick={() => this.onChangeTab('posts')} className={active === 'posts' ? 'mr-2 btn btn-lg btn-primary' : 'mr-2 btn btn-lg btn-outline-primary'}>
                                                        <i className='mdi mdi-polaroid'></i> Posts
                                                    </button>
                                                    <button onClick={() => this.onChangeTab('reels')} className={active === 'reels' ? 'mr-2 btn btn-lg btn-primary' : 'mr-2 btn btn-lg btn-outline-primary'}>
                                                        <i className='mdi mdi-view-carousel'></i> Reels
                                                    </button>
                                                </>
                                            )
                                        }

                                    </div>
                                    <div className="col-auto">
                                        <select disabled={this.state.loadingContent || this.state.loading} onChangeCapture={(evt) => this._onChangeSort(evt)} className='form-control border-gray'>
                                            <option disabled selected>- Sort Posts By -</option>
                                            <option value="likes">Like Count</option>
                                            <option value="comments">Comment Count</option>
                                            {
                                                active === 'reels' ? (
                                                    <option value="views">Reels Play Count</option>
                                                ) : null
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {
                        loadingContent ? this._renderLoadingCard() : null
                    }

                    {
                        active === 'posts' ?
                            showData.length > 0 ? showData.map((dat) => {
                                return (
                                    <div className='col-6 col-md-6 col-lg-4'>
                                        {this._renderIgPost(dat)}
                                    </div>
                                )
                            }) : null : null

                    }
                    {
                        active === 'reels' ?
                            showDataReels.length > 0 ? showDataReels.map((dat) => {
                                return (
                                    <div className='col-6 col-md-6 col-lg-4'>
                                        {this._renderIgReels(dat)}
                                    </div>
                                )
                            }) : null : null
                    }

                </div>
            </div>
        );
    }
}

export default IgUser;