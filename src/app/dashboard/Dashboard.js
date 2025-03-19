import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import common from '../../utils/common';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from 'react-fullscreen-loading';
import { Link } from 'react-router-dom';
import apiService from '../../utils/apiService';
// import AwesomeSlider from 'react-awesome-slider';
// import 'react-awesome-slider/dist/styles.css';
// import withAutoplay from 'react-awesome-slider/dist/autoplay';


class Dashboard extends Component {

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
      showGreeting: true,
      showModal: true
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
      this._getUserInfo();
    });
  }

  _getUserInfo() {
    let tmpRequest = {
      'id_user': this.state.dataUser.id_user,
    };
    this._showLoading();
    apiService.invoke("GET_USER_INFO", tmpRequest,
      (success) => {
        this._hideLoading();
        if (success.code === '200') {
          this.setState({ dataUser: success.data }, () => {
            if (success.data.is_login === '1' && success.data.is_google_register === '1') {
              this._goto("/changepassword");
              toast.warning("Please change your password");
            }
            reactLocalStorage.set('credential', JSON.stringify(success.data));
          })
        }
      }, (error) => {
        this._hideLoading();
      });
  }

  _goto(v, param) {
    this.props.history.push(v, param);
  }

  _showLoading() {
    this.setState({ loadingDashboard: true })
  }
  _hideLoading() {
    this.setState({ loadingDashboard: false })
  }

  _comingSoon() {
    toast.warning("This feature is still under development, Stay Tuned!");
  }

  _renderTiktokVideo = (dat) => {
    return (
      <div className='card card-shadow mb-3' >
        <div className='card-header'>
          <center>
            {
              dat.platform === 'tiktok' ? (
                <img alt="" src={require('../../assets/images/tiktok.png')} width={70} />
              ) : dat.platform === 'facebook' ? (
                <img alt="" src={require('../../assets/images/facebook.png')} width={70} />
              ) : dat.platform === 'instagram' ? (
                <img alt="" src={require('../../assets/images/instagram.png')} width={100} />
              ) : null
            }
          </center>

        </div>
        <div className='text-black'>
          <video src={dat.url} style={{ height: 200 }} className='w-100' controls>
          </video>
          <div className='mt-3 pl-3 pr-3 pb-2'>
            <h4><Link onClick={() => this._goto('detail')}>{dat.title.substring(0, 40) + '...'}</Link></h4>
            <div className='row text-primary'>
              <div className='col'>
                <p><i className='mdi mdi-account'></i> Username</p>
              </div>
              <div className='col-auto'>
                <p><i className='fa fa-globe'></i> US</p>
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

  render() {
    const { loadingDashboard, showGreeting } = this.state;
    // const AutoplaySlider = withAutoplay(AwesomeSlider);
    return (
      <div >
        <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />

        <div className='row'>
          <div className='col-md-12 mb-3'>
            {
              showGreeting ? (
                <div className='card' >
                  <div className='p-5' style={{ marginTop: -45 }}>
                    <div className='row pr-3'>
                      <div className='col-md-4'>
                        <img className='p-1' src={require('../../assets/images/welcome.gif')} alt="welcome" width={'100%'} />
                      </div>
                      <div className='col-md-8'>
                        <h1 className='text-primary mt-5'>Welcome to Julya<br></br>Save Time Finding Viral Content.</h1>
                        <h5 className='text-primary mt-3'>Julya offers an easier method to discover top-performing content on Social Media.</h5>
                        <div className='row p-2 mt-3'>
                          <Link to="/searchtiktok" className="btn btn-dark btn-lg mr-2 mt-2"><img src={require("../../assets/images/tiktok-white.png")} alt="" width={15} /> Tiktok</Link>
                          <Link to="/igfinduser" className="btn btn-primary btn-lg mr-2 mt-2"><i className='mdi mdi-instagram'></i> Instagram</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            }

          </div>
          {/* <div className='col-md-6 mb-3'>
            <AutoplaySlider
              play={true}
              cancelOnInteraction={false} // should stop playing on user interaction
              interval={3000}
            >
              <div data-src={require('../../assets/images/slider1.png')} />
              <div data-src={require('../../assets/images/slider2.png')} />
            </AutoplaySlider>
          </div> */}
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-6 col-lg-3'>
                <div className='card card-shadow mb-3'>
                  <div className='pt-3 pl-3 pb-0 text-black'>
                    <div className='row'>
                      <div className='col-2'>
                        <i className='mdi mdi-magnify fa-2x text-gray'></i>
                      </div>
                      <div className='col-10'>
                        <p>Tiktok Search</p>
                        {
                          this.state.dataUser.is_unlimited_tiktok === '1' ? (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>Unlimited</h4>
                          ) : (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>{common.formatThousand(this.state.dataUser.tiktok_search_count)}</h4>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-6 col-lg-3'>
                <div className='card card-shadow mb-3' >
                  <div className='pt-3 pl-3 pb-0 text-black'>
                    <div className='row'>
                      <div className='col-2'>
                        <i className='mdi mdi-instagram fa-2x text-gray'></i>
                      </div>
                      <div className='col-10'>
                        <p>Instagram Search</p>
                        {
                          this.state.dataUser.is_unlimited_ig === '1' ? (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>Unlimited</h4>
                          ) : (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>{common.formatThousand(this.state.dataUser.ig_search_count)}</h4>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-6 col-lg-3'>
                <div className='card card-shadow mb-3' >
                  <div className='pt-3 pl-3 pb-0 text-black'>
                    <div className='row'>
                      <div className='col-2'>
                        <i className='mdi mdi-atom fa-2x text-gray'></i>
                      </div>
                      <div className='col-10'>
                        <p>AI Count</p>
                        {
                          this.state.dataUser.is_unlimited_ai === '1' ? (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>Unlimited</h4>
                          ) : (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>{common.formatThousand(this.state.dataUser.ai_search_count)}</h4>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-6  col-lg-3'>
                <div className='card card-shadow mb-3' >
                  <div className='pt-3 pl-3 pb-0 text-black'>
                    <div className='row'>
                      <div className='col-2'>
                        <i className='mdi mdi-chart-arc fa-2x text-gray'></i>
                      </div>
                      <div className='col-10'>
                        <p>Save Count</p>
                        {
                          this.state.dataUser.is_unlimited_save === '1' ? (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>Unlimited</h4>
                          ) : (
                            <h4 className='text-primary' style={{ marginTop: -12 }}>{common.formatThousand(this.state.dataUser.save_count)}</h4>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
            </div>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-6 col-md-4 col-lg-3'>
            <div className='card card-shadow mb-3' >
              <div className='card-body p-3 pb-0 text-black'>
                <center>
                  <img alt="" src={require("../../assets/images/tiktok.png")} width={150} />
                  <p className='mt-3'>You can search the <b>viral content</b> according users or keywords</p>
                </center>
              </div>
              <div className='p-2 text-primary'>
                <div className='row'>
                  <div className='col-md-12'>
                    <Link to="/tiktok" className="btn btn-primary btn-lg w-100"><i className='mdi mdi-magnify'></i> Search Content</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-6 col-md-4 col-lg-3'>
            <div className='card card-shadow mb-3' >
              <div className='card-body p-2 text-black'>
                <center>
                  <img alt="" src={require("../../assets/images/instagram.png")} width={200} />
                  <p className='mt-1'>You can search <b>Posts, Reels, Analytics, Users</b> and <b>Hashtags</b></p>
                </center>
              </div>
              <div className='p-2 text-primary'>
                <div className='row'>
                  <div className='col-md-12'>
                    <Link to="/igfinduser" className="btn btn-primary btn-lg w-100"><i className='mdi mdi-magnify'></i>Search User</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-6 col-md-4 col-lg-3'>
            <div className='card card-shadow mb-3' >
              <div className='card-body text-black'>
                <center>
                  <img alt="" src={require("../../assets/images/facebook.png")} width={180} />
                  <p className='mt-3'>You can search the <b>viral content</b> according users or keywords</p>
                </center>
              </div>
              <div className='p-2 text-primary'>
                <div className='row'>
                  <div className='col-md-12'>
                    <Link to="/comingsoon" className="btn btn-primary btn-gray btn-lg w-100"><i className='mdi mdi-wrench'></i>Coming Soon</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-6 col-md-4 col-lg-3'>
            <div className='card card-shadow mb-3' >
              <div className='card-body text-black'>
                <center>
                  <img alt="" src={require("../../assets/images/youtube.png")} width={180} />
                  <p className='mt-3'>You can search the <b>viral content</b> according users or keywords</p>
                </center>
              </div>
              <div className='p-2 text-primary'>
                <div className='row'>
                  <div className='col-md-12'>
                    <Link to="/comingsoon" className="btn btn-primary btn-gray btn-lg w-100"><i className='mdi mdi-wrench'></i>Coming Soon</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default Dashboard;