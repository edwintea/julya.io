import React, { Component } from 'react'
import apiService from '../../utils/apiService';
import { reactLocalStorage } from 'reactjs-localstorage';
import BarLoader from "react-spinners/BarLoader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from 'react-bootstrap';
import Loading from 'react-fullscreen-loading';

class editUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUser: {},
            loading: false,
            invalidUsername: false,
            invalidEmail: false,
            invalidNama: false,
            invalidTelp: false,
            invalidRole: false,
            invalidPass1: false,
            invalidPass2: false,
            invalidConfirm: false,

            id: "",
            username: "",
            email: "",
            role: "",
            nama: "",
            telp: "",
            pass1: "",
            pass2: "",
            status: 0
        }

    }

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let dataUser = JSON.parse(datacred);
        if (dataUser.role === 'gudang' || dataUser.role === 'owner') {
            this._goto('/dashboard');
        } else {
            this.setState({ dataUser: dataUser }, () => {
                let data = this.props.history.location.state;
                if(data){
                    this.setState({
                        id: data.id_user,
                        username: data.username,
                        nama: data.nama,
                        email: data.email,
                        telp: data.no_telp,
                        role: data.role,
                        status: data.is_active
                    })
                }
                
            });
        }
    }


    _goto(v) {
        this.props.history.push(v);
    }


    _showLoading() {
        this.setState({ loading: true })
    }
    _hideLoading() {
        this.setState({ loading: false })
    }

    _submit() {
        let userData = this.state.dataUser;
        let tmpRequest = {
            "id_user": this.state.id,
            "nama": this.state.nama,
            "username": this.state.username,
            "email": this.state.email,
            "no_telp": this.state.telp,
            "role": 'admin',
            "is_active": this.state.status,
            "user_id": userData.id_user,
        };
        this._showLoading()
        apiService.invoke("EDIT_USER", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    toast.success("Succesfuly Updated User");
                    this._goto('/user/data');
                }else if (success.code === '301') {
                    toast.warning(success.message);
                }else{
                    toast.error("Something went wrong, please reload page!");
                }
            }, (error) => {
                toast.error("Something went wrong, please reload page!");
                this._hideLoading();
            });
    }

    _onChangeUsername(evt) {
        let nama = evt.target.value;
        this.setState({ username: nama, invalidUsername: false }, () => {
        });
    }

    _onChangeEmail(evt) {
        let nama = evt.target.value;
        this.setState({ email: nama, invalidEmail: false }, () => {
        });
    }

    _onChangeTelp(evt) {
        let nama = evt.target.value;
        this.setState({ telp: nama, invalidTelp: false }, () => {
        });
    }

    _onChangeRole(evt) {
        let nama = evt.target.value;
        this.setState({ role: nama, invalidRole: false }, () => {
        });
    }

    _onChangeStatus(evt) {
        let nama = evt.target.value;
        this.setState({ status: nama, invalidStatus: false }, () => {
        });
    }

    _onChangeNama(evt) {
        let nama = evt.target.value;
        this.setState({ nama: nama, invalidNama: false }, () => {
        });
    }


    _beforeSubmit() {
        const { nama, username, email, telp } = this.state;
        if (nama !== '' && username !== '' && email !== '' && telp !== '') {
            this._submit();

        } else {
            if (username === '') {
                this.setState({ invalidUsername: true })
            } else if (nama === '') {
                this.setState({ invalidNama: true })
            } else if (email === '') {
                this.setState({ invalidEmail: true })
            } else if (telp === '') {
                this.setState({ invalidTelp: true })
            } 
        }
    }

    render() {
        const { invalidTelp, invalidEmail, invalidUsername, invalidNama, loading, } = this.state;
        return (
            <div>
                <Loading loading={loading} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#!()" onClick={() => this._goto("/dashboard")}>Dashboard</a></li>
                        <li className="breadcrumb-item"><a href="#!()" onClick={() => this._goto("/user/data")}>User List</a></li>
                        <li className="breadcrumb-item " aria-current="page">Update User</li>
                    </ol>
                </nav>
                <div className="row justify-content-center">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-header">
                                <h3 className='page-title text-primary'>Update User</h3>
                            </div>
                            <div className="card-body">
                                <div className="form-sample">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Username</label>
                                                <div className="col-sm-5">
                                                    <Form.Control value={this.state.username} onChangeCapture={(val) => this._onChangeUsername(val)} type="text" placeholder="Username..." />
                                                    {
                                                        invalidUsername ? (
                                                            <label style={{ color: "red", marginTop: 10 }}>Username must be filled!</label>
                                                        ) : null
                                                    }
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Name</label>
                                                <div className="col-sm-5">
                                                    <div className="input-group">
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">
                                                                <span className="mdi mdi-account"></span>
                                                            </span>
                                                        </div>
                                                        <Form.Control value={this.state.nama} onChangeCapture={(val) => this._onChangeNama(val)} type="text" placeholder="Name..." />
                                                    </div>
                                                    {
                                                        invalidNama ? (
                                                            <label style={{ color: "red", marginTop: 10 }}>Name must be filled!</label>
                                                        ) : null
                                                    }
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Email</label>
                                                <div className="col-sm-5">
                                                    <div className="input-group">
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">
                                                                <span className="mdi mdi-email"></span>
                                                            </span>
                                                        </div>
                                                        <Form.Control value={this.state.email} onChangeCapture={(val) => this._onChangeEmail(val)} type="email" placeholder="Email..." />
                                                    </div>
                                                    {
                                                        invalidEmail ? (
                                                            <label style={{ color: "red", marginTop: 10 }}>Email must be filled!</label>
                                                        ) : null
                                                    }
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Phone</label>
                                                <div className="col-sm-5">
                                                    <div className="input-group">
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">
                                                                <span className="mdi mdi-phone"></span>
                                                            </span>
                                                        </div>
                                                        <Form.Control value={this.state.telp} onChangeCapture={(val) => this._onChangeTelp(val)} type="number" placeholder="Phone..." />
                                                    </div>
                                                    {
                                                        invalidTelp ? (
                                                            <label style={{ color: "red", marginTop: 10 }}>Phone must be filled!</label>
                                                        ) : null
                                                    }
                                                </div>
                                            </Form.Group>

                                        </div>
                                    </div>
                                    <hr />
                                    <center>
                                        {
                                            loading ? (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BarLoader color={'white'} loading={true} size={60} height={5} />
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => this._beforeSubmit()} type="submit" className="btn btn-lg btn-primary mr-2">Submit</button>
                                                    <button onClick={() => this._goto("/user/data")} className="btn btn-lg btn-dark">Cancel</button>
                                                </>
                                            )
                                        }
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default editUser
