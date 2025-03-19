import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import apiService from '../../utils/apiService';
import { reactLocalStorage } from 'reactjs-localstorage';
import BarLoader from "react-spinners/BarLoader";
import config from '../../utils/config';
import { toast } from 'react-toastify';
import common from '../../utils/common';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      emptyUsername: false,
      emptyPassword: false,
      invalidEmail: false,
      invalidCredential: false,
      invalidCredential2: false,
      invalidCredential3: false,
      invalidCredential4: false,
      invalidCredential5: false,
      rememberMe: false,
      loading: false,
      showPass: false,
      ipAddress: '',
      is_exp: false
    }

  }

  componentDidMount() {
    let datacred = reactLocalStorage.get('credential');
    let is_exp = reactLocalStorage.get('is_exp');
    let islogin = reactLocalStorage.get('islogin');
    let remember = reactLocalStorage.get('remember');
    let usernames = reactLocalStorage.get('username');

    this._getIpAddress();

    if (is_exp === 'true') {
      toast.warning("Session timeout, please re-login");
    }
    if (islogin === 'true' && datacred) {
      window.location.assign('/dashboard');
    }else{
       
    }

    if (remember === 'true') {
      this.setState({ rememberMe: true, username: usernames });
    }

    console.log("props : ", this.props)

  }

  _getIpAddress() {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data =>
        this.setState({ ipAddress: data.ip }, () => {
          console.log("ip : ", this.state.ipAddress);
        })
      ).catch(error =>
        console.log(error)
      );

  }

  _onChangeUsername = (val) => {
    this.setState({ invalidCredential: false, emptyUsername: false, username: val.target.value, invalidEmail: false });
  }

  _onChangePassword = (val) => {

    this.setState({ invalidCredential: false, emptyPassword: false, password: val.target.value });
  }

  stateManage(state = [], action) {
    return state;
  }

  _goto(v) {
    this.props.history.push(v);
  }

  _submitLogin = () => {
    let username = this.state.username;
    let password = this.state.password;
    if (username === '' && password === '') {

      this.setState({ emptyUsername: true, emptyPassword: true })
    } else if (username === '') {
      this.setState({ emptyUsername: true })
    } else if (password === '') {
      this.setState({ emptyPassword: true })
    } else {
      this._initiateLogin();
    }
  }

  _initiateLogin() {
    let tmpRequestLogin = {
      username: this.state.username,
      password: this.state.password,
      ip_address: this.state.ipAddress
    };
    this._showLoading();
    apiService.invoke("LOGIN", tmpRequestLogin,
      (success) => {
        if (success.code === '200') {
          if (this.state.rememberMe) {
            reactLocalStorage.set('remember', 'true');
            reactLocalStorage.set('username', tmpRequestLogin.username);
          } else {
            reactLocalStorage.set('username', '');
            reactLocalStorage.set('remember', 'false');
          }
          reactLocalStorage.remove('is_exp');
          let dataUser = success.data;
          localStorage.setItem('islogin', 'true');
          localStorage.setItem('credential', JSON.stringify(dataUser));
          localStorage.setItem('jwt_token', success.token);
          window.fpr("referral",{email: dataUser.email});
          window.location.assign('/dashboard');
        } else if (success.code === '404') {
          this._hideLoading();
          this.setState({ invalidCredential2: true })
        } else {
          this._hideLoading();
          this.setState({ invalidCredential: true })
        }
      }, (error) => {
        console.log("error : ", error);
        this._hideLoading();
        this.setState({ invalidCredential: true })
      });
  }

  _initiateLoginGoogle = (response) => {
    let responsePayload = common.decodeJwtResponse(response.credential);
    console.log('response : ', responsePayload);
    let tmpRequestLogin = {
      data_user: responsePayload
    };
    this._showLoading();
    apiService.invoke("LOGIN_GOOGLE", tmpRequestLogin,
      (success) => {
        this._hideLoading();
        if (success.code === '200') {
          reactLocalStorage.remove('is_exp');
          let dataUser = success.data;
          localStorage.setItem('islogin', 'true');
          localStorage.setItem('credential', JSON.stringify(dataUser));
          localStorage.setItem('jwt_token', success.token);
          localStorage.setItem('tiktok_token', success.tiktok_token);
          window.fpr("referral",{email: dataUser.email});
          window.location.assign('/dashboard');
        } else {
          this._hideLoading();
          this.setState({ invalidCredential: true })
        }
      }, (error) => {
        console.log("error : ", error);
        this._hideLoading();
        this.setState({ invalidCredential: true })
      });
  }

  _onChangeRememberMe() {
    let checked = this.state.rememberMe;
    if (checked === false) {
      this.setState({ rememberMe: true })
    } else {
      this.setState({ rememberMe: false })
    }
  }

  _showLoading() {
    this.setState({ loading: true })
  }
  _hideLoading() {
    this.setState({ loading: false })
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this._submitLogin();
    }
  }


  render() {
    const { emptyUsername, emptyPassword, invalidCredential, invalidCredential2,
      invalidCredential3, invalidEmail, rememberMe, loading } = this.state;
    return (
      <div style={{backgroundImage:'url(https://t4.ftcdn.net/jpg/01/90/74/63/360_F_190746317_qjZikoohn97kiJrWpJZJLHilBXKVWTAD.jpg)', backgroundSize:"cover", paddingTop:'2%', paddingBottom:250}}>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5 my-5">
                <center>
                  <div className="mb-4">
                    <img src={require("../../assets/images/logo.png")} alt="logo" width={80} />
                  </div>
                  <h3 className='text-black'>{config.APP_INFO.APP_Name}</h3>
                  <p className="font-weight-dark text-muted">Sign in your account to continue</p>

                </center>
                <div className="pt-2">
                  <Form.Group className="d-flex search-field">
                    <Form.Control disabled={loading} className={emptyUsername || invalidCredential || invalidEmail ? 'h-auto border-danger' : 'h-auto'} onChangeCapture={(val) => this._onChangeUsername(val)} onKeyDown={(e) => this._handleKeyDown(e)} value={this.state.username} type="email" placeholder="Email..." size="lg" />
                  </Form.Group>
                  {
                    emptyUsername ? (
                      <label style={{ color: "red", fontSize: 14 }}>Email must be filled!</label>
                    ) : null
                  }

                  <Form.Group className="d-flex search-field">
                    <div className="input-group">
                      <Form.Control disabled={loading} className={emptyPassword || invalidCredential ? 'h-auto border-danger' : 'h-auto'} onChangeCapture={(val) => this._onChangePassword(val)} onKeyDown={(e) => this._handleKeyDown(e)} value={this.state.password} type={this.state.showPass ? 'text' : 'password'} placeholder="Password..." size="lg" />
                      <div className="input-group-append">
                        <span className="input-group-text" style={{ borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                          {
                            this.state.showPass ? (
                              <a href="#!" onClick={() => this.setState({ showPass: false })} className="auth-link text-white text-sm">
                                <span className="mdi mdi-eye-off-outline"></span>
                              </a>
                            ) : (
                              <a href="#!" onClick={() => this.setState({ showPass: true })} className="auth-link text-white text-sm">
                                <span className="mdi mdi-eye-outline"></span>
                              </a>
                            )
                          }
                        </span>
                      </div>
                    </div>
                  </Form.Group>

                  <div className="justify-content-between align-items-center">
                    <div className="">
                      {
                        emptyPassword ? (
                          <label style={{ color: "red", fontSize: 14 }}>Password must be filled!</label>
                        ) : null
                      }
                      {
                        invalidCredential ? (
                          <label style={{ color: "red", fontSize: 14 }}>Wrong username or password!</label>
                        ) : null
                      }
                      {
                        invalidCredential2 ? (
                          <label style={{ color: "red", fontSize: 14 }}>User not registered!</label>
                        ) : null
                      }
                      {
                        invalidCredential3 ? (
                          <label style={{ color: "red", fontSize: 14 }}>Google login failed!</label>
                        ) : null
                      }
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col'>
                      <div className="form-check">
                        <label className="form-check-label text-muted">
                          <input onClick={() => this._onChangeRememberMe()} checked={rememberMe} type="checkbox" className="form-check-input" />
                          <i className="input-helper"></i>
                          Remember Me
                        </label>
                      </div>
                    </div>
                    <div className='col-auto'>
                      <div className="form-check">
                        <label className="form-check-label text-muted">
                          <Link className="text-muted" style={{ fontSize: 14 }} to="/forgotpassword">Forgot Password?</Link>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 mb-2">
                    <button disabled={loading} onClick={() => this._submitLogin()} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" >
                      {
                        loading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarLoader color={'white'} loading={true} size={60} height={5} />
                          </div>
                        ) : 'Sign In'
                      }
                    </button>
                  </div>
                  <h5 className='textLine'><span>OR</span></h5>
                  <center>
                    <GoogleLogin
                      shape="pill"
                      logo_alignment="center"
                      onSuccess={response => {
                        this._initiateLoginGoogle(response)
                      }}

                      onError={() => {
                        this.setState({ invalidCredential3: true })
                      }}
                      useOneTap
                    />
                  </center>
                  <div className='mt-4 text-primary'>
                    <center>
                      <div>
                        <p className='text-primary'>Don't have an account yet? Sign up <Link to="/register">Here</Link></p>
                      </div>
                    </center>
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

export default Login
