import React, { Component } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import apiService from '../../utils/apiService';
import common from '../../utils/common';
import config from '../../utils/config';
import { Link } from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from 'react-bootstrap';
import Loading from 'react-fullscreen-loading';
import { Lightbox } from "react-modal-image";
import 'react-alert-confirm/dist/index.css';
import alertConfirm from 'react-alert-confirm';

class userProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUser: {
                nama: "",
                img_plan: "bambino.png"
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
            base64: "",
            dataTrx: [],
            name_plan:"-",
            exp_date:new Date(),
            is_expire:'0',
            img_plan:"bambino.png"
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
            }, () => {
                this._getUserInfo();
            });
        });
    }

    _getUserInfo() {
        this._showLoading();
        let tmpRequest = {
          'id_user': this.state.dataUser.id_user,
        };
        apiService.invoke("GET_USER_INFO", tmpRequest,
          (success) => {
            if (success.code === '200') {
              this.setState({ dataUser: success.data, name_plan:success.data.name_plan, 
                exp_date:success.data.exp_date, is_expire:success.data.is_expire, img_plan:success.data.img_plan }, () => {
                reactLocalStorage.set('credential', JSON.stringify(success.data));
                this._getTrx();
              })
            }
          }, (error) => {
          });
      }

    _getTrx() {
        let tmpRequest = {
            user_id: this.state.dataUser.id_user,
        };
        apiService.invoke("GET_TRX", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    let hasil = success.data.reverse();
                    let final = [];
                    for (let index = 0; index < hasil.length; index++) {
                        let stripes = JSON.parse(hasil[index].stripe_response);
                        hasil[index].url_trx = stripes.url;
                        final.push(hasil[index]);
                    }
                    this.setState({ dataTrx: success.data });
                }
            }, (error) => {
                this._hideLoading();
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


    _onChangeUsername(evt) {
        let val = evt.target.value;
        this.setState({ username: val, invalidUsername: false, onUpdate: true });
    }
    _onChangeName(evt) {
        let val = evt.target.value;
        this.setState({ name: val, invalidName: false, onUpdate: true });
    }
    _onChangeEmail(evt) {
        let val = evt.target.value;
        this.setState({ email: val, invalidEmail: false, onUpdate: true });
    }

    _onChangeFotoUser = async (event) => {
        const file = event.target.files[0]
        const base64 = await common.convertBase64(file)
        this.setState({ base64: base64, onUpdate: true });
    }

    _beforeSubmitUser() {
        const { name, email } = this.state;
        if (name !== '' && email !== '') {
            this._submitUser();
        } else {
            if (name === '') {
                this.setState({ invalidName: true })
            } else if (email === '') {
                this.setState({ invalidEmail: true })
            }
        }
    }

    _submitUser() {
        this._showLoading();
        let tmpRequest = {
            id_user: this.state.dataUser.id_user,
            nama: this.state.name,
            email: this.state.email,
            foto: this.state.base64,
        };
        apiService.invoke("EDIT_USER", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    reactLocalStorage.set('credential', JSON.stringify(success.data));
                    toast.success("User Updated");
                    this._goto("/dashboard");
                } else if (success.code === '301') {
                    toast.warning(success.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }, (error) => {
                this._hideLoading();
                toast.error("Something went wrong!");
            });
    }

    _validateStatus(status) {
        if (status === '1') {
            return (
                <span className='text-success'>
                    <i className='mdi mdi-check-circle'></i> Paid
                </span>
            )
        } else if (status === '0') {
            return (
                <span className='text-warning'>
                    <i className='mdi mdi-clock'></i> Pending
                </span>
            )
        } else if (status === '2') {
            return (
                <span className='text-danger'>
                    <i className='mdi mdi-close-circle'></i> Canceled
                </span>
            )
        }
    }

    _onOpenImage(source, nama) {
        this.setState({ sourceImage: source, namaImage: nama }, () => {
            this.setState({ openImage: true })
        })
    }


    _confirmCancel(id, name) {
        window.scrollTo(0, 0);
        alertConfirm({
            title: 'Confirm Cancelation',
            content: 'Are you sure want to cancel ' + name + ' plan activation?',
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                this._submitCancelPlan(id);
            },
            onCancel: () => {
            },
        });
    }

    _submitCancelPlan(trxId) {
        this._showLoading();
        let tmpRequest = {
            user_id: this.state.dataUser.id_user,
            trx_id: trxId
        };
        apiService.invoke("CANCEL_TRX", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    toast.success("Plan activation canceled");
                    this._getTrx();
                } else {
                    toast.error("Something went wrong!");
                }
            }, (error) => {
                this._hideLoading();
                toast.error("Something went wrong!");
            });
    }

    _sendLink() {
        let tmpRequestLogin = {
            email: this.state.email,
        };
        this._showLoading();
        apiService.invoke("SEND_VERIFY", tmpRequestLogin,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    toast.success("We've sent you verification link");
                    this._goto("/dashboard");
                } else {
                    toast.error("Something went wrong, please try again!");
                }
            }, (error) => {
                toast.error("Something went wrong, please try again!");
                this._hideLoading();
            });
    }

    render() {
        const { loading, email, name, userFoto,
            invalidName, invalidEmail, dataTrx } = this.state;
        return (
            <div>
                <Loading loading={loading} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
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
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#!()" onClick={() => this._goto("/dashboard")}>Dashboard</a></li>
                        <li className="breadcrumb-item " aria-current="page">Profile Account</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className='card mb-3' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                            <div className='p-3 text-primary'>
                                <div className='row'>
                                    <div className='col-2'>
                                        <center>
                                            <img alt="" src={require('../../assets/images/' + this.state.img_plan)} width={'100%'} />
                                        </center>
                                    </div>
                                    <div className='col-8'>
                                        <h3 className='text-primary'>{this.state.name_plan} <img alt={this.state.name_plan} title={this.state.name_plan} src={require('../../assets/images/ig-badge.png')} width={30} />
                                        </h3>
                                        <h5>Valid Until : {this.state.is_expire === '1' ? 'Expired' : common.dateFormatNoDays(this.state.exp_date)}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{ boxShadow: '5px 5px 5px lightblue' }}>
                            <div className="card-header text-primary">
                                <div className='row'>
                                    <div className='col'>
                                        <h4>Activation History</h4>
                                    </div>
                                    <div className='col-auto'>
                                        <Link to="/upgrade" className="btn btn-primary btn-icon-split">
                                            <span className="text">
                                                <i className="mdi mdi-check-circle-outline"></i> Upgrade Plan
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {
                                dataTrx.length > 0 ? (
                                    <div className='table-responsive' style={{ height: 300, overflow: "auto" }}>
                                        <table id="dataTable" className="table">
                                            <thead style={{ position: "sticky", top: 0 }}>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Date</th>
                                                    <th>Plan</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    dataTrx.map((dats, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{common.formatDateCal(dats.date_trx)}</td>
                                                                <td>{dats.name_plan} (€{dats.price_plan})</td>
                                                                <td>{this._validateStatus(dats.status_trx)}</td>
                                                                <td>
                                                                    <div className='btn-group'>

                                                                        {
                                                                            dats.status_trx === '0' ? (
                                                                                <>
                                                                                    <a title='Detail' href={dats.url_trx} target='_blank' rel="noopener noreferrer" className='btn btn-primary'>
                                                                                        <i className='mdi mdi-credit-card'></i>
                                                                                    </a>
                                                                                    <button title="Cancel" className='btn btn-danger' onClick={() => this._confirmCancel(dats.id_trx, dats.name_plan)}>
                                                                                        <i className='mdi mdi-close-circle'></i>
                                                                                    </button>
                                                                                </>
                                                                            ) : '-'
                                                                        }
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className='card-body text-primary'>
                                        <div style={{ marginTop: '3%', marginBottom: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <center>
                                                <img alt="notfound" src={require('../../assets/images/search.png')} width={100} />
                                                <h2>There's nothing here<br></br><center><p className='mt-2'>You can upgrade by click upgrade button above.</p></center></h2>
                                            </center>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card" style={{ boxShadow: '5px 5px 5px lightblue' }}>
                            <div className="card-header text-primary">
                                <h4>User Account</h4>
                            </div>
                            <div className="card-body">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Profile Picture</label>
                                    <div className="col-3">
                                        {
                                            this.state.base64 !== '' ? (
                                                <Link onClick={() => this._onOpenImage(this.state.base64, name)}>
                                                    <img alt="" width="100" src={this.state.base64} />
                                                </Link>
                                            ) : (
                                                <Link onClick={() => this._onOpenImage(config.IMAGE_URL + '/member/' + userFoto, name)}>
                                                    <img alt="" width="100" src={userFoto ? config.IMAGE_URL + '/member/' + userFoto : require("../../assets/images/member/user.png")} />
                                                </Link>
                                            )
                                        }
                                    </div>
                                    <div className="col-6">
                                        <Form.Control onChangeCapture={(evt) => this._onChangeFotoUser(evt)} type="file" className="form-control" placeholder="File..." />
                                    </div>
                                </Form.Group>
                                <hr />
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Full Name</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                    <span className="mdi mdi-account"></span>
                                                </div>
                                            </div>
                                            <Form.Control className={invalidName ? 'border-danger' : ''} value={name} type="text" onChange={(evt) => this._onChangeName(evt)} placeholder="Full Name..." />
                                        </div>
                                        {
                                            invalidName ? (
                                                <label style={{ color: "red", marginTop: 10 }}>Name required!</label>
                                            ) : null
                                        }
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">Email</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <div className="input-group-text" style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                                                    <span className="mdi mdi-email"></span>
                                                </div>
                                            </div>
                                            <Form.Control className={invalidEmail ? 'border-danger' : ''} value={email} type="email" onChange={(evt) => this._onChangeEmail(evt)} placeholder="Email..." />
                                        </div>
                                        {
                                            this.state.dataUser.is_active === '0' ? (
                                                <label style={{ color: "red", marginTop: 10 }}>
                                                    <i className='mdi mdi-minus-circle-outline'></i>Unverified <Link className="text-info" onClick={() => this._sendLink()}>
                                                    Verify Email Here</Link></label>
                                            ) : (
                                                <label className='text-info' style={{marginTop: 10 }}>
                                                     <img alt="verify" title="Verified" src={require('../../assets/images/ig-badge.png')} width={20} className='pb-1'/> Verified</label>
                                            )
                                        }
                                        {
                                            invalidEmail ? (
                                                <label style={{ color: "red", marginTop: 10 }}>Email required!</label>
                                            ) : null
                                        }

                                    </div>
                                </Form.Group>
                                <hr />
                                <center>
                                    {
                                        loading ? (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BarLoader color={'#2e1c5e'} loading={true} size={60} height={5} />
                                            </div>
                                        ) : (
                                            <>
                                                <button disabled={!this.state.onUpdate} onClick={() => this._beforeSubmitUser()} type="submit" className="btn btn-lg btn-primary mr-2">Update</button>
                                            </>
                                        )
                                    }
                                    <img alt="" id="image" />
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default userProfile
