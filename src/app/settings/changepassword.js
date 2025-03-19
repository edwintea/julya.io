import React, { Component } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import apiService from '../../utils/apiService';
import BarLoader from "react-spinners/BarLoader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-alert-confirm/dist/index.css';
import { Form } from 'react-bootstrap';
import Loading from 'react-fullscreen-loading';

class changePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUser: {
                nama: ""
            },
            data: [],
            hasilFilter: [],
            username: "",
            name: "",
            email: "",
            userFoto: "",
            curPass: "",
            pass1: "",
            pass2: "",
            invalidName: false,
            invalidEmail: false,
            invalidTelp: false,
            invalidUsername: false,
            invalidCurpass: false,
            invalidPass1: false,
            invalidPass2: false,
            onUpdate: false,
            loading: false,
            base64: ""
        }

    }

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let users = JSON.parse(datacred);
        this.setState({ dataUser: users }, () => {
            this.setState({
                name: users.nama,
                username: users.username,
                email: users.email,
                telp: users.no_telp,
                userFoto: users.foto
            })
        });
    }

    _showLoading() {
        this.setState({ loading: true })
    }
    _hideLoading() {
        this.setState({ loading: false })
    }

    _goto(v, params) {
        this.props.history.push(v, params);
    }

    _beforeSubmitPassword() {
        const { curPass, pass1, pass2 } = this.state;

        if (curPass !== '' && pass1 !== '' && pass2 !== '') {
            if (pass1 !== pass2) {
                this.setState({ invalidConfirm: true })
            } else {
                this._submitPassword();
            }
        } else {
            if (curPass === '') {
                this.setState({ invalidCurpass: true })
            }
            if (pass1 === '') {
                this.setState({ invalidPass1: true })
            }
            if (pass2 === '') {
                this.setState({ invalidPass2: true })
            }
        }
    }

    _submitPassword() {
        let userData = this.state.dataUser;
        let tmpRequest = {
            username: userData.email,
            user_id: userData.id_user,
            password_lama: this.state.curPass,
            password_baru: this.state.pass1
        };
        this._showLoading()
        apiService.invoke("EDIT_PASSWORD", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    if (success.message === 'passwordlamasalah') {
                        this.setState({ wrongCurpass: true });
                    } else {
                        toast.success("Successfully Changed Password");
                        this._goto("/dashboard");
                    }
                } else {
                    toast.error("Something went wrong!");
                }
            }, (error) => {
                this._hideLoading();
                toast.error("Something went wrong!");
            });
    }

    _onChangeCurrentPass(evt) {
        let val = evt.target.value;
        this.setState({ curPass: val, invalidCurpass: false, wrongCurpass: false })
    }

    _onChangePass1(evt) {
        let val = evt.target.value;
        this.setState({ pass1: val, invalidPass1: false })
    }

    _onChangePass2(evt) {
        let val = evt.target.value;
        this.setState({ pass2: val, invalidPass2: false })
    }


    render() {
        const { loading, invalidConfirm,
            invalidCurpass, invalidPass1, invalidPass2, wrongCurpass,
            curPass, pass1, pass2 } = this.state;
        return (
            <div>
                <Loading loading={loading} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#!()" onClick={() => this._goto("/dashboard")}>Dashboard</a></li>
                        <li className="breadcrumb-item " aria-current="page">Change Password</li>
                    </ol>
                </nav>
                <div className="row" style={{marginBottom:200}}>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header text-primary">
                                <h4>Update Password</h4>
                            </div>
                            <div className="card-body">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Password</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                    <span className="mdi mdi-lock"></span>
                                                </div>
                                            </div>
                                            <input value={curPass} onChange={(evt) => this._onChangeCurrentPass(evt)} className={invalidCurpass || wrongCurpass ? "form-control border-danger" : "form-control"} type="password" placeholder="current password..." />
                                        </div>
                                        {
                                            invalidCurpass ? (
                                                <label style={{ color: "red", marginTop: 10 }}>Password must be filled!</label>
                                            ) : null
                                        }
                                        {
                                            wrongCurpass ? (
                                                <label style={{ color: "red", marginTop: 10 }}>Missmatch current password!</label>
                                            ) : null
                                        }
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">New Password</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                    <span className="mdi mdi-lock"></span>
                                                </div>
                                            </div>
                                            <input value={pass1} onChange={(evt) => this._onChangePass1(evt)} className={invalidPass1 ? "form-control border-danger" : "form-control"} type="password" placeholder="new password..." />
                                        </div>
                                        {
                                            invalidPass1 ? (
                                                <label style={{ color: "red", marginTop: 10 }}>New Password must be filled!</label>
                                            ) : null
                                        }
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Confirmation</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                    <span className="mdi mdi-lock"></span>
                                                </div>
                                            </div>
                                            <input value={pass2} onChange={(evt) => this._onChangePass2(evt)} className={invalidPass2 || invalidConfirm ? "form-control border-danger" : "form-control"} type="password" placeholder="retype new password..." />
                                        </div>
                                        {
                                            invalidPass2 ? (
                                                <label style={{ color: "red", marginTop: 10 }}>Confirmation must be filled!</label>
                                            ) : null
                                        }
                                        {
                                            invalidConfirm ? (
                                                <label style={{ color: "red", marginTop: 10 }}>Wrong Confirmation!</label>
                                            ) : null
                                        }
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="card-footer">
                                <center>
                                    {
                                        loading ? (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BarLoader color={'#2e1c5e'} loading={true} size={60} height={5} />
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => this._beforeSubmitPassword()} type="submit" className="btn btn-lg btn-primary mr-2">Update</button>
                                            </>
                                        )
                                    }
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default changePassword
