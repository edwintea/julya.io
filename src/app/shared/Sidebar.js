import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      dataBranch: {},
      saldo: 0,
    };
  }

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/usertiktok', state: 'tiktokMenuOpen' },
      { path: '/tiktok', state: 'tiktokMenuOpen' },
      { path: '/searchtiktok', state: 'tiktokMenuOpen' },
      { path: '/hashtagtiktok', state: 'tiktokMenuOpen' },

      { path: '/igpost', state: 'instagramMenuOpen' },
      { path: '/igreel', state: 'instagramMenuOpen' },
      { path: '/igfinduser', state: 'instagramMenuOpen' },
      { path: '/iguser', state: 'instagramMenuOpen' },
      { path: '/ighashtag', state: 'instagramMenuOpen' },
      { path: '/igreel', state: 'instagramMenuOpen' },

      { path: '/fbpost', state: 'facebookMenuOpen' },
      { path: '/fbreel', state: 'facebookMenuOpen' },

      { path : '/transcripttiktok', state : 'transcriptMenuOpen'},
      { path : '/transcriptig', state : 'transcriptMenuOpen'},

      { path : '/upload', state : 'videoMenuOpen'},
      { path : '/project', state : 'videoMenuOpen'},
      { path : '/videosubtitle', state : 'videoMenuOpen'}

    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top bg-primary">
          <a className="sidebar-brand brand-logo bg-primary" href="/dashboard">
            <img src={require('../../assets/images/logo3.png')} alt="logo" className='h-50' />
          </a>
          <a className="sidebar-brand brand-logo-mini" href="/dashboard"><img style={{ width: 40, height: 40 }} src={require('../../assets/images/logo.png')} alt="logo" /></a>
        </div>
        <ul className="nav">
          <li className="nav-item nav-category">
            <span className="nav-link">Dashboard</span>
          </li>
          <li className={this.isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-icon"><i className="mdi mdi-speedometer"></i></span>
              <span className="menu-title">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link">Platforms</span>
          </li>

          <li className={this.isPathActive('/tiktok') || this.isPathActive('/searchtiktok') || this.isPathActive('/hashtagtiktok') || this.isPathActive('/usertiktok') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.tiktokMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('tiktokMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <img alt="tiktok" src={require("../../assets/images/tiktok2.png")} width={15} />
              </span>
              <span className="menu-title">Tiktok</span>
              <i className="menu-arrow"></i>
            </div>

            <Collapse in={this.state.tiktokMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/tiktok') ? 'nav-link active' : 'nav-link'} to="/tiktok">For You Page</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/searchtiktok') ? 'nav-link active' : 'nav-link'} to="/searchtiktok">Search Content</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/hashtagtiktok') ? 'nav-link active' : 'nav-link'} to="/hashtagtiktok">Hashtag Search</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/usertiktok') ? 'nav-link active' : 'nav-link'} to="/usertiktok">Track Competitors</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li className={this.isPathActive('/igfinduser') || this.isPathActive('/iguser') || this.isPathActive('/ighashtag') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.instagramMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('instagramMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-instagram"></i>
              </span>
              <span className="menu-title">Instagram</span>
              <i className="menu-arrow"></i>
            </div>

            <Collapse in={this.state.instagramMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/igfinduser') ? 'nav-link active' : 'nav-link'} to="/igfinduser">Find User</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/iguser') ? 'nav-link active' : 'nav-link'} to="/iguser">User Profile</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/ighashtag') ? 'nav-link active' : 'nav-link'} to="/ighashtag">Hashtag Search</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
        
          <li className={this.isPathActive('/transcripttiktok') || this.isPathActive('/transcriptig') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.transcriptMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('transcriptMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
              <i className="mdi mdi-message-text-outline"></i>
              </span>
              <span className="menu-title">Transcript</span>
              <i className="menu-arrow"></i>
            </div>

            <Collapse in={this.state.transcriptMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/transcripttiktok') ? 'nav-link active' : 'nav-link'} to="/transcripttiktok">Tiktok</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/transcriptig') ? 'nav-link active' : 'nav-link'} to="/transcriptig">Instagram</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/aijulya') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <Link className="nav-link" to="/aijulya">
              <span className="menu-icon">
              <i className="mdi mdi-atom"></i>
              </span>
              <span className="menu-title">Julya AI</span>
            </Link>
          </li>
          <li className={this.isPathActive('/upload') || this.isPathActive('/project') || this.isPathActive('/videosubtitle') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.videoMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('videoMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
              <i className="mdi mdi-message-video"></i>
              </span>
              <span className="menu-title">Video Subtitle</span>
              <i className="menu-arrow"></i>
            </div>

            <Collapse in={this.state.videoMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/upload') ? 'nav-link active' : 'nav-link'} to="/upload">New Project</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/project') ? 'nav-link active' : 'nav-link'} to="/project">My Projects</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/comingsoon') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <Link className="nav-link" to="/comingsoon">
              <span className="menu-icon"><i className="mdi mdi-youtube"></i></span>
              <span className="menu-title">Youtube</span>
            </Link>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link">Help Center</span>
          </li>
          <li className={'nav-item menu-items active mt-2'}>
            <Link to="/upgrade" className="nav-link bg-semi">
              <span className="menu-icon"><i className="mdi mdi-medal-outline"></i></span>
              <span className="menu-title">Upgrade Plan</span>
            </Link>
          </li>
          <li className={'nav-item menu-items active mt-2'}>
            <a href="https://discord.gg/XFvtEs68rM" target='_blank' rel="noopener noreferrer" className="nav-link bg-info">
              <span className="menu-icon"><i className="mdi mdi-discord"></i></span>
              <span className="menu-title">Contact Us</span>
            </a>
          </li>
          <li className={'nav-item menu-items active mt-2'}>
            <a href="https://julya.io" target='_blank' rel="noopener noreferrer" className="nav-link bg-warning">
              <span className="menu-icon"><i className="mdi mdi-web"></i></span>
              <span className="menu-title">Official Website</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    let userDatas = reactLocalStorage.get('credential');
    if (userDatas) {
       let dataUser = JSON.parse(userDatas)
       this.setState({ userData: dataUser })
    }
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);