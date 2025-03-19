import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import apiService from '../../utils/apiService';
import BarLoader from "react-spinners/BarLoader";
import { toast } from 'react-toastify';
import common from '../../utils/common';

class Resetpassword extends Component {

    constructor(props) {
        super(props);
        this.state = {

            emptyPassword: false,
            emptyPassword2: false,
            invalidConfirmation: false,
            loading: false,
            showPass: false,
            showPass2: false,
            is_exp: false
        }

    }

    componentDidMount() {
        if(common.getQueryVariable('token')){
            let token = common.getQueryVariable('token');
            console.log("token : ", token);
        }else{
            // this._goto('login');
        }
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
        let password = this.state.password;
        let password2 = this.state.password2;
        let email = this.state.email;
        if (password === '') {
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
                    this._submitReset();
                }

            }
        }
    }

    _submitReset() {
        let tmpRequestLogin = {
            token: this.state.token,
            password: this.state.password
        };
        this._showLoading();
        apiService.invoke("RESET_PASSWORD", tmpRequestLogin,
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
            this._submitReset();
        }
    }

    _recaptcha(value) {
        this.setState({ captcha: value });
    }


    render() {
        const { emptyPassword, emptyPassword2,
            invalidConfirmation, loading } = this.state;
        return (
            <div>
                <div className="d-flex align-items-center auth px-0">
                    <div className="row w-100 mx-0">
                        <div className="col-lg-4 mx-auto mt-4">
                            <div className="card text-left py-3 px-3 px-sm-5">
                                <center>
                                    <div className="mb-4 mt-3">
                                        <img src={require("../../assets/images/logo.png")} alt="logo" width={60} />
                                    </div>
                                    <h3 className='text-black'>Reset Password</h3>
                                    <p className="font-weight-dark text-muted">Create your new password.</p>
                                </center>
                                <div className="pt-2">

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

                                    <div className="mt-4">
                                        <button disabled={loading} onClick={() => this._submitLogin()} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" >
                                            {
                                                loading ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <BarLoader color={'white'} loading={true} size={60} height={5} />
                                                    </div>
                                                ) : 'Reset'
                                            }
                                        </button>
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

export default Resetpassword
