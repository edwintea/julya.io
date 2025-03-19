import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import apiService from '../../utils/apiService';
import { reactLocalStorage } from 'reactjs-localstorage';
import BarLoader from "react-spinners/BarLoader";
import { toast } from 'react-toastify';
import common from '../../utils/common';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            password2: "",
            captcha: "test",
            emptyUsername: false,
            emptyPassword: false,
            emptyPassword2: false,
            invalidEmail: false,
            invalidEmail2: false,
            invalidCredential: false,
            invalidConfirmation: false,
            invalidAgree: false,
            agree: false,
            loading: false,
            showPass: false,
            showPass2: false,
            ipAddress: '',
            is_exp: false,
        }

    }

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let islogin = reactLocalStorage.get('islogin');

        this._getIpAddress();
        if (islogin === 'true' && datacred) {
            window.location.assign('/dashboard');
        }
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
    _onChangeEmail = (val) => {
        this.setState({ invalidCredential: false, emptyEmail: false, email: val.target.value, invalidEmail: false, invalidEmail2: false });
    }
    _onChangePassword = (val) => {
        this.setState({ invalidCredential: false, invalidConfirmation: false, emptyPassword: false, password: val.target.value });
    }
    _onChangePassword2 = (val) => {

        this.setState({ invalidCredential: false, invalidConfirmation: false, emptyPassword2: false, password2: val.target.value });
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
        let password2 = this.state.password2;
        let email = this.state.email;
        let agree = this.state.agree;
        let captcha = this.state.captcha;

        if (username === '' && password === '' && email === '' && password2 === '') {
            this.setState({ emptyUsername: true, emptyPassword: true, emptyPassword2: true, emptyEmail: true })
        } else if (username === '') {
            this.setState({ emptyUsername: true })
        } else if (email === '') {
            this.setState({ emptyEmail: true })
        } else if (password === '') {
            this.setState({ emptyPassword: true })
        } else if (password2 === '') {
            this.setState({ emptyPassword2: true })
        } else {
            if (!common.emailRegex(email)) {
                this.setState({ invalidEmail: true })
            } else {
                if (password !== password2) {
                    this.setState({ invalidConfirmation: true })
                } else {
                    if (agree === false) {
                        this.setState({ invalidAgree: true })
                    } else {
                        if (captcha === '') {
                            toast.warning("Please submit reCaptcha!");
                        } else {
                            this._initiateLogin();
                        }
                    }
                }
            }
        }
    }

    _initiateLogin() {
        let tmpRequestLogin = {
            name: this.state.username,
            email: this.state.email,
            password: this.state.password
        };
        this._showLoading();
        apiService.invoke("REGISTER", tmpRequestLogin,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    toast.success("Registered, We've sent you verification account link");
                    this._goto("/login");
                } else if (success.code === '301') {
                    this.setState({ invalidEmail2: true })
                } else {
                    toast.error("Something went wrong, please try again!");
                }
            }, (error) => {
                toast.error("Something went wrong, please try again!");
                this._hideLoading();
            });
    }

    _onChangeRememberMe() {
        let agree = this.state.agree;
        if (agree === false) {
            this.setState({ agree: true, invalidAgree: false })
        } else {
            this.setState({ agree: false })
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

    _recaptcha(value) {
        this.setState({ captcha: value });
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
                    window.fpr("referral", { email: dataUser.email });
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


    render() {
        const { emptyUsername, emptyPassword, emptyPassword2, invalidEmail2,
            invalidConfirmation, emptyEmail, invalidEmail, agree, loading, invalidAgree, invalidCredential } = this.state;
        return (
            <div style={{ backgroundImage: 'url(https://t4.ftcdn.net/jpg/01/90/74/63/360_F_190746317_qjZikoohn97kiJrWpJZJLHilBXKVWTAD.jpg)', backgroundSize: "cover", paddingTop: '2%', paddingBottom: 250 }}>
                <div className="d-flex align-items-center auth px-0">
                    <div className="row w-100 mx-0">
                        <div className="col-lg-4 mx-auto mt-4 my-5">
                            <div className="card text-left py-3 px-3 px-sm-5">
                                <center>
                                    <div className="mb-4 mt-3">
                                        <img src={require("../../assets/images/logo.png")} alt="logo" width={60} />
                                    </div>
                                    <h3 className='text-black'>Account Sign Up</h3>
                                    <p className="font-weight-dark text-muted">Fill sign up form below continue.</p>
                                </center>
                                <center>
                                    <GoogleLogin
                                        shape="pill"
                                        logo_alignment="center"
                                        text='continue_with'
                                        onSuccess={response => {
                                            this._initiateLoginGoogle(response)
                                        }}
                                        onError={() => {
                                            this.setState({ invalidCredential: true })
                                        }}
                                        auto_select={false}
                                    />
                                </center>
                                {
                                    invalidCredential ? (
                                        <label style={{ color: "red", fontSize: 14 }}>Sign Up Google Failed!</label>
                                    ) : null
                                }
                                <h5 className='textLine'><span>OR</span></h5>
                                <div className="pt-2">
                                    <Form.Group className="d-flex search-field">
                                        <Form.Control disabled={loading} className={emptyUsername ? 'h-auto border-danger' : 'h-auto'} onChangeCapture={(val) => this._onChangeUsername(val)} onKeyDown={(e) => this._handleKeyDown(e)} value={this.state.username} type="text" placeholder="Name..." size="lg" />
                                    </Form.Group>
                                    {
                                        emptyUsername ? (
                                            <label style={{ color: "red", fontSize: 14 }}>Name must be filled!</label>
                                        ) : null
                                    }

                                    <Form.Group className="d-flex search-field">
                                        <Form.Control disabled={loading} className={emptyEmail || invalidEmail || invalidEmail2 ? 'h-auto border-danger' : 'h-auto'} onChangeCapture={(val) => this._onChangeEmail(val)} onKeyDown={(e) => this._handleKeyDown(e)} value={this.state.email} type="email" placeholder="Email..." size="lg" />
                                    </Form.Group>
                                    {
                                        emptyEmail ? (
                                            <label style={{ color: "red", fontSize: 14 }}>Email must be filled!</label>
                                        ) : null
                                    }

                                    {
                                        invalidEmail ? (
                                            <label style={{ color: "red", fontSize: 14 }}>Must be an email format!</label>
                                        ) : null
                                    }

                                    {
                                        invalidEmail2 ? (
                                            <label style={{ color: "red", fontSize: 14 }}>This email is taken, please try another email!</label>
                                        ) : null
                                    }

                                    <Form.Group className="d-flex search-field">
                                        <div className="input-group">
                                            <Form.Control disabled={loading} className={emptyPassword || invalidConfirmation ? 'h-auto border-danger' : 'h-auto'} onChangeCapture={(val) => this._onChangePassword(val)} onKeyDown={(e) => this._handleKeyDown(e)} value={this.state.password} type={this.state.showPass ? 'text' : 'password'} placeholder="Password..." size="lg" />
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
                                    {
                                        emptyPassword ? (
                                            <label style={{ color: "red", fontSize: 14 }}>Password must be filled!</label>
                                        ) : null
                                    }


                                    <Form.Group className="d-flex search-field">
                                        <div className="input-group">
                                            <Form.Control disabled={loading} className={emptyPassword || invalidConfirmation ? 'h-auto border-danger' : 'h-auto'} onChangeCapture={(val) => this._onChangePassword2(val)} onKeyDown={(e) => this._handleKeyDown(e)} value={this.state.password2} type={this.state.showPass2 ? 'text' : 'password'} placeholder="Retype - Password..." size="lg" />
                                            <div className="input-group-append">
                                                <span className="input-group-text" style={{ borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                                                    {
                                                        this.state.showPass2 ? (
                                                            <a href="#!" onClick={() => this.setState({ showPass2: false })} className="auth-link text-white text-sm">
                                                                <span className="mdi mdi-eye-off-outline"></span>
                                                            </a>
                                                        ) : (
                                                            <a href="#!" onClick={() => this.setState({ showPass2: true })} className="auth-link text-white text-sm">
                                                                <span className="mdi mdi-eye-outline"></span>
                                                            </a>
                                                        )
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </Form.Group>

                                    {
                                        invalidConfirmation ? (
                                            <label style={{ color: "red", fontSize: 14 }}>Missmatch Password Confirmation!</label>
                                        ) : null
                                    }
                                    {
                                        emptyPassword2 ? (
                                            <label style={{ color: "red", fontSize: 14 }}>Confirmation must be filled!</label>
                                        ) : null
                                    }
                                    <div className="form-check">
                                        <label className="form-check-label text-muted">
                                            <input onClick={() => this._onChangeRememberMe()} checked={agree} type="checkbox" className="form-check-input" />
                                            <i className="input-helper"></i>
                                            I have read and agree to the applicable terms and conditions, Read <a href="https://www.julya.io/termsofuse" target='_blank' rel="noopener noreferrer">Here</a>
                                        </label>
                                    </div>
                                    {
                                        invalidAgree ? (
                                            <label style={{ color: "red", fontSize: 14 }}>Make sure you have agreed with terms and conditions!</label>
                                        ) : null
                                    }
                                    <div className="mt-4">
                                        <button disabled={loading} onClick={() => this._submitLogin()} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" >
                                            {
                                                loading ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <BarLoader color={'white'} loading={true} size={60} height={5} />
                                                    </div>
                                                ) : 'Register'
                                            }
                                        </button>
                                    </div>
                                    <div className='mt-3 text-primary'>
                                        <center>
                                            <div>
                                                <p className='text-primary'>Login your account <Link to="/login">Here</Link></p>

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

export default Register
