import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { isMobile } from 'react-device-detect';
import "../../i18n";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import common from '../../utils/common';
import config from '../../utils/config';

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      ismobile: false,
      key: "",
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
        }
      ]
    };
  }

  componentDidMount() {
    let userDatas = reactLocalStorage.get('credential');
    if (userDatas) {
      let dataUser = JSON.parse(userDatas);
      this.setState({ userData: dataUser }, () => {

      });
    }
    if (isMobile) {
      this.setState({ ismobile: isMobile }, () => {
        document.body.classList.toggle('sidebar-icon-only');
      });
    }

    // const { i18n } = this.props;
    // let lang = reactLocalStorage.get('en');
    // if (lang === 'en') {
    //   i18n.changeLanguage('en');

    // } else {
    //   i18n.changeLanguage('id');

    // }
  }

  _onChangeLang(v) {
    const { i18n } = this.props;
    if (v === 'en') {
      reactLocalStorage.set('lang', 'en');
      i18n.changeLanguage('en');
      toast.success("Successfuly change language to English");
    } else {
      reactLocalStorage.set('lang', 'id');
      i18n.changeLanguage('id');
      toast.success("Berhasil mengubah bahasa ke Bahasa Indonesia");
    }
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }


  _doLogout = () => {
    this.props.logout();
  }

  _goto(v, param) {
    this.props.history.push(v, param);
  }

  _onSearch = (evt) => {
    // let obj = {
    //   from: 'dashboard',
    //   key: this.state.key,
    //   field: "id"
    // }
    // this._goto('/contract/data', obj);
  }

  _onSearchSpk = (evt) => {
    // if (this.isPathActive('/contract/detail')) {
    //   let tmpParam = evt.value;
    //   tmpParam['is_search_spk'] = 'true';
    //   console.log("tmpparam : ", tmpParam);
    //   this._goto('/contract/data', tmpParam);
    // } else {
    //   this._goto('/contract/detail', evt.value);
    // }
  }

  isPathActive(path) {
    return window.location.pathname.startsWith(path);
  }

  _onSearchBranch = (evt) => {
    let obj = {
      from: 'dashboard',
      key: evt.value,
      field: "branch"
    }
    this._goto('/contract/data', obj);
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this._onSearch();
    }
  }

  _onChangeSearch = (val) => {
    this.setState({ key: val })
  }

  render() {
    const { userData } = this.state;
    return (
      <>
        <nav className="navbar p-0 fixed-top d-flex flex-row" style={{ zIndex: 3 }}>
          <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
            <Link className="navbar-brand" to="/"><img src={require('../../assets/images/favicon.png')} alt="logo" /></Link>
          </div>
          <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
            <button className="navbar-toggler align-self-center" type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
              <span className="mdi mdi-menu"></span>
            </button>
            <ul className="navbar-nav w-100">
              <li className="nav-item w-100">
                <div className="nav-link">
                </div>
              </li>
              {
                userData.plan_id === config.DEFAULT_PLAN ? null : (
                  <li className="nav-item">
                    <div className="nav-link">
                      <Link title="Save" to="./saved">
                        <div style={{ backgroundColor: "red", fontSize: 10, color: "#fff", fontWeight: "bold", padding: 4, borderRadius: 50, position: "absolute", marginTop: -9, marginLeft: 15 }}>
                          {common.formatThousand(userData.saved_count)}
                        </div>
                        <img alt="" src={require("../../assets/images/unsave.png")} width={25} />
                      </Link>
                    </div>
                  </li>
                )
              }
              <li className="nav-item">
                <div className="nav-link">
                  <Link title="English" to="/">
                    EN
                  </Link>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav navbar-nav-right">
              <Dropdown alignRight as="li" className="nav-item">
                <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                  <div className="navbar-profile">
                    <img className="img-xs rounded-circle" src={userData.foto ? config.IMAGE_URL + '/member/' + userData.foto : require('../../assets/images/member/user.png')} alt="profile" />
                    <p className="mb-0 d-none d-sm-block navbar-profile-name font-weight-200">{userData.nama} {
                      userData.is_active === '1' ? (
                        <img alt="verify" title="Verified" src={require('../../assets/images/ig-badge.png')} width={25} />
                      ) : null
                    }</p>
                    <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                  <h6 className="p-3 mb-0">{userData.nama}
                    {
                      userData.is_active === '1' ? (
                        <img alt="verify" title="Verified" src={require('../../assets/images/ig-badge.png')} width={25} />
                      ) : null
                    }
                  </h6>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={(evt) => this._goto('/profile')} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-account text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1">Profile Account</p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(evt) => this._goto('/changepassword')} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-lock text-danger"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1">Change Password</p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(evt) => this._goto('/saved')} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-content-save text-info"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1">({common.formatThousand(userData.saved_count)}) Saved</p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={(evt) => this._doLogout()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-logout text-danger"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1">Logout</p>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ul>
            <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={this.toggleOffcanvas}>
              <span className="mdi mdi-menu"></span>
            </button>
          </div>
        </nav >
      </>
    );
  }
}

export default Navbar;
