import React, { Component } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import apiService from '../../utils/apiService';
import BarLoader from "react-spinners/BarLoader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import 'react-alert-confirm/dist/index.css';
import alertConfirm from 'react-alert-confirm';
import Loading from 'react-fullscreen-loading';

class UserData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUser: {},
            data: [],
            hasilFilter: [],
            name: "",
            loading: false
        }

    }

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let dataUser = JSON.parse(datacred);
            this.setState({ dataUser: dataUser }, () => {
                this._getData();
            });
        

    }

    _getData = () => {
        let tmpRequest = {
            id_user:  "",
            user_id:this.state.dataUser.id_user,
        };
        this._showLoading()
        apiService.invoke("GET_USER", tmpRequest,
            (success) => {
                this._hideLoading();
                let hasil = success.data.reverse();
                for (let i = 0; i < hasil.length; i++) {
                    if (hasil[i].id_user === this.state.dataUser.id_user) {
                        hasil.splice(i,1);
                    }
                }
                this.setState({ data: hasil, hasilFilter: hasil }, () => {
                });
            }, (error) => {
                toast.error("Something went wrong!");
                this._hideLoading();
            });
    }

    onChangeSearch = (event) => {
        const { data } = this.state;
        if (event.target.value) {
            this.setState({ hasilFilter: [], name: event.target.value }, () => {
                let filteredResult = [];
                let val = this.state.name.toLowerCase();
                var filteredValue = data.filter(item => item.nama.toLowerCase().indexOf(val) > -1);
                if (filteredValue.length !== 0) {
                    filteredResult = filteredValue;
                }
                if (filteredResult.length !== 0) {
                    this.setState({ hasilFilter: filteredResult });
                }
                console.log("hasilFilter : ", filteredResult);
            });
        } else {
            this.setState({ hasilFilter: data });
        }
    }

    _showLoading() {
        this.setState({ loading: true })
    }
    _hideLoading() {
        this.setState({ loading: false })
    }

    _goto(v, param) {
        this.props.history.push(v, param);
    }

    _confirmDelete(id) {
        window.scrollTo(0, 0);
        alertConfirm({
            title: 'Confirmation',
            content: 'Are you sure want to activate?',
            okText: "Yes",
            cancelText: "Cancel",
            onOk: () => {
                this._delete(id);
            },
            onCancel: () => {
            },
        });
    }

    _confirmNoActive(id) {
        window.scrollTo(0, 0);
        alertConfirm({
            title: 'Confirmation',
            content: 'Are you sure want to deactivate?',
            okText: "Yes",
            cancelText: "Cancel",
            onOk: () => {
                this._noActive(id);
            },
            onCancel: () => {
            },
        });
    }


    _delete = (id) => {
        let tmpRequest = {
            id_user: id,
            "user_id": this.state.dataUser.id_user ,
            "is_active" : 1
        };
        this._showLoading();
        apiService.invoke("ACTIVATION_USER", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    this.setState({ hasilFilter: [], data: [] }, () => {
                        toast.success("Successfuly activate user");
                        this._getData(this.state.dataUser, false);
                    });
                } else {
                    toast.error("Something went wrong!");
                }
            }, (error) => {
                toast.error("Something went wrong!");
                this._hideLoading();
            });
    }

    _noActive = (id) => {
        let tmpRequest = {
            id_user: id,
            "user_id": this.state.dataUser.id_user ,
            "is_active" : 0
        };
        this._showLoading();
        apiService.invoke("ACTIVATION_USER", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    this.setState({ hasilFilter: [], data: [] }, () => {
                        toast.success("Successfuly deactivate user");
                        this._getData(this.state.dataUser, false);
                    });
                } else {
                    toast.error("Something went wrong!");
                }
            }, (error) => {
                toast.error("Something went wrong!");
                this._hideLoading();
            });
    }

    render() {
        const { hasilFilter, loading } = this.state;
        return (
            <div>
                <Loading loading={loading} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#!()" onClick={() => this._goto("/dashboard")}>Dashboard</a></li>
                        <li className="breadcrumb-item " aria-current="page">User List</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col">
                                        <h3 className='page-title text-primary'>User List</h3>
                                    </div>
                                    <div className="col-auto">
                                        <Link to="/user/add" className="btn btn-primary btn-icon-split">
                                            <span className="text">
                                                <i className="mdi mdi-plus"></i> Add User
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="input-group p-3">
                                    <div className="input-group-append">
                                        <div className="input-group-text" style={{borderTopLeftRadius:12, borderBottomLeftRadius:12}}>
                                            <span className="mdi mdi-magnify"></span>
                                        </div>
                                    </div>
                                    <input onChangeCapture={(evt) => this.onChangeSearch(evt)} type="text" placeholder="Name..." maxLength={25} className="form-control" />
                                </div>
                                <div className="table-responsive" style={{ height: '100%' }}>
                                    {
                                        loading ? (
                                            <div style={{ marginTop: '10%', marginBottom: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BarLoader color={'white'} loading={true} size={60} height={5} />
                                            </div>
                                        ) : hasilFilter.length > 0 ? (
                                            <table id="dataTable" className="table">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Username</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Status</th>
                                                        <th style={{ textAlign: "right" }}>  </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        hasilFilter.map((dat, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td> {dat.username}</td>
                                                                    <td> {dat.nama}</td>
                                                                    <td> {dat.email}</td>
                                                                    <td> {dat.no_telp}</td>
                                                                    <td>{
                                                                        dat.is_active === '0' ? (
                                                                            <span className="badge badge-danger">
                                                                               <i className='mdi mdi-close'></i> No Active
                                                                            </span>
                                                                        ) : (
                                                                            <span className="badge badge-success">
                                                                               <i className='mdi mdi-check'></i> Active
                                                                            </span>
                                                                        )}</td>
                                                                    <td style={{ textAlign: "right" }}>
                                                                        <div className="btn-group" role="group" aria-label="Basic example">
                                                                        {
                                                                                dat.is_active === '1' ? (
                                                                                    <button onClick={() => this._confirmNoActive(dat.id_user)} type="button" className="btn btn-danger">
                                                                                        <i className="mdi mdi-close btn-icon-prepend"></i>
                                                                                    </button>
                                                                                ) : (
                                                                                    <button onClick={() => this._confirmDelete(dat.id_user)} type="button" className="btn btn-success">
                                                                                    <i className="mdi mdi-check btn-icon-prepend"></i>
                                                                                </button>
                                                                                )
                                                                            }
                                                                            <button onClick={() => this._goto('/user/edit', dat)} type="button" className="btn btn-warning">
                                                                                <i className="mdi mdi-pencil btn-icon-prepend"></i>
                                                                            </button>
                                                                           
                                                                            
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div style={{ marginTop: '10%', marginBottom: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', color:"#000" }}>

                                                <h2>User not found!</h2>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserData
