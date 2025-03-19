import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import apiService from '../../utils/apiService';
import { reactLocalStorage } from 'reactjs-localstorage';
import BarLoader from "react-spinners/BarLoader";
import { toast } from 'react-toastify';
import common from '../../utils/common';
import { Link } from 'react-router-dom'

class Forgotpassword extends Component {

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
            is_exp: false
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

        this.setState({ invalidCredential: false, emptyPassword: false, password: val.target.value });
    }
    _onChangePassword2 = (val) => {

        this.setState({ invalidCredential: false, emptyPassword2: false, password2: val.target.value });
    }

    stateManage(state = [], action) {
        return state;
    }

    _goto(v) {
        this.props.history.push(v);
    }

    _submitLogin = () => {
        let email = this.state.email;

        if (email === '') {
            this.setState({ emptyEmail: true })
        } else {
            if (!common.emailRegex(email)) {
                this.setState({ invalidEmail: true })
            } else {
                this._initiateLogin();
            }
        }
    }

    _initiateLogin() {
        let tmpRequestLogin = {
            email: this.state.email,
        };
        this._showLoading();
        apiService.invoke("FORGOT_PASSWORD", tmpRequestLogin,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    toast.success("Submitted, We've sent you confirmation link to your email");
                    this._goto("/login");
                } else if (success.code === '404') {
                    this.setState({ invalidEmail2: true })
                } else {
                    toast.error("Something went wrong, please try again!");
                }
            }, (error) => {
                toast.error("Something went wrong, please try again!");
                this._hideLoading();
            });
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


    render() {
        const { invalidEmail2, emptyEmail, invalidEmail, loading } = this.state;
        return (
            <div style={{backgroundImage:'url(https://t4.ftcdn.net/jpg/01/90/74/63/360_F_190746317_qjZikoohn97kiJrWpJZJLHilBXKVWTAD.jpg)', backgroundSize:"cover", paddingTop:'2%', paddingBottom:250}}>

                <div className="d-flex align-items-center auth px-0">
                    <div className="row w-100 mx-0">
                        <div className="col-lg-4 mx-auto mt-4">
                            <div className="card text-left py-3 px-3 px-sm-5 my-5 mb-5">
                                <center>
                                    <div className="mb-4 mt-3">
                                        <img src={require("../../assets/images/logo.png")} alt="logo" width={60} />
                                    </div>
                                    <h3 className='text-black'>Forgot Password</h3>
                                    <p className="font-weight-dark text-muted">Enter your email to reset your password.</p>
                                </center>
                                <div className="pt-2">
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
                                            <label style={{ color: "red", fontSize: 14 }}>Your email is not registered!</label>
                                        ) : null
                                    }
                                    <div className="mt-4">
                                        <button disabled={loading} onClick={() => this._submitLogin()} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" >
                                            {
                                                loading ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <BarLoader color={'white'} loading={true} size={60} height={5} />
                                                    </div>
                                                ) : 'Submit'
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

export default Forgotpassword
