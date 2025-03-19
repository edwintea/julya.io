import React, { Component } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-alert-confirm/dist/index.css';
import alertConfirm from 'react-alert-confirm';
import Loading from 'react-fullscreen-loading';

class Upgrade extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataUser: {
                nama: ""
            },
            data: [],
            hasilFilter: [],
            onUpdate: false,
            loading: false,
            emptyPlan: false,
            listPlan: [],
            dataPlan: [],
            plan: "",
            sorts: 'month'
        }

    }

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let users = JSON.parse(datacred);
        this.setState({ dataUser: users }, () => {
            if (this.state.dataUser.is_active === '0') {
                toast.warning("Please verify your account first");
                this._goto("/profile");
            } else {
                this._getPlan();
            }
        });
    }

    _getPlan() {
        this._showLoading();
        let tmpRequest = {
            user_id: this.state.dataUser.id_user,
        };
        apiService.invoke("GET_PLAN", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    let hasil = success.data;
                    let final = [];
                    for (let index = 0; index < hasil.length; index++) {
                        final.push(hasil[index]);
                    }
                    this.setState({ listPlan: final, dataPlan: final }, () => {
                        this._onChangeSort();
                    });
                }
            }, (error) => {
                this._hideLoading();
            });
    }

    _getActivation() {
        this._showLoading();
        let tmpRequest = {
            user_id: this.state.dataUser.id_user,
        };
        apiService.invoke("GET_ACTIVATION", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '200') {
                    this.setState({ dataHistory: success.data.reverse() });
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

    _submitTrx(planId) {
        this._showLoading();
        let tmpRequest = {
            "user_id": this.state.dataUser.id_user,
            "plan_id": planId
        };
        apiService.invoke("ADD_TRX", tmpRequest,
            (success) => {
                this._hideLoading();
                if (success.code === '201') {
                    let hasil = JSON.parse(success.data);
                    window.location.href = hasil.url;
                } else if (success.code === '301') {
                    toast.error(success.message);
                    this._goto("/profile");
                }
            }, (error) => {
                this._hideLoading();
                toast.error("Something went wrong!");
            });
    }


    _confirmActivate(id, name) {
        window.scrollTo(0, 0);
        alertConfirm({
            title: 'Purchase Confirmation',
            content: 'Are you sure want to make payment for ' + name + ' plan?',
            okText: "Yes, Proceed",
            cancelText: "Cancel",
            onOk: () => {
                this._submitTrx(id);
            },
            onCancel: () => {
            },
        });
    }

    _onChangeSort = (evt) => {
        console.log("evt : ", evt);
        let value = 'year';
        if (this.state.sorts === 'month') {
            value = 'year';
        } else if (this.state.sorts === 'year') {
            value = 'month';
        }
        this.setState({
            sorts: value
        }, () => {
            let data = this.state.dataPlan;
            let filter = [];
            if (value === 'month') {
                filter = data.filter(item => item.yearly_plan.indexOf(0) > -1);
            } else if (value === 'year') {
                filter = data.filter(item => item.yearly_plan.indexOf(1) > -1);
            }
            this.setState({ listPlan: filter });
        })
    }

    render() {
        const { loading, listPlan } = this.state;
        return (
            <div>
                <Loading loading={loading} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />
                <div className="row">
                    <div className='col-md-12 mb-3'>
                        <div className="card">
                            <div className='card-body'>
                                <div className='row justify-content-center text-primary mr-3'>
                                    <h4 className='pr-2 pt-1 font-weight-bold'>Monthly</h4>
                                    <label className="switch">
                                        <input onClick={(evt) => this._onChangeSort(evt)} value={this.state.sorts} type="checkbox" checked={this.state.sorts === 'year'} />
                                        <span className="slider round"></span>
                                    </label>
                                    <h4 className='pl-2 pt-1 font-weight-bold'>Yearly</h4>
                                </div>
                                <div className='text-primary'>
                                    <center className='mr-3'>
                                        <h6>Save Up to 15% <img alt="" src={require("../../assets/images/arrowright.png")} width={25} className='pb-4' /></h6>
                                    </center>
                                </div>
                                <div className='row justify-content-center' style={{ marginTop: 80 }}>
                                    {
                                        listPlan.map((dats, index) => {
                                            return (
                                                <div className='col-12 col-md-6 col-lg-4 mb-3'>
                                                    <div className='card' style={{ boxShadow: '5px 5px 5px lightblue', marginTop: dats.is_recommended === '1' ? -50 : 0, borderColor: dats.is_recommended === '1' ? "#2e1c5e" : "#ccc", borderWidth: dats.is_recommended === '1' ? 4 : 1 }}>
                                                        {
                                                            dats.is_recommended === '1' ? (
                                                                <center>
                                                                    <div style={{ marginTop: -15 }}>
                                                                        <span className='badge badge-primary'>Recommended</span>
                                                                    </div>
                                                                </center>

                                                            ) : null
                                                        }
                                                        <div className='card-body text-primary'>
                                                            <div className='mt-2'>
                                                                <center>
                                                                    <img alt="" src={require('../../assets/images/' + dats.img_plan)} width={70} />
                                                                    <h2 className='mt-3'>{dats.name_plan}</h2>
                                                                    {
                                                                        dats.yearly_plan === '1' ? (
                                                                            <h5 className='font-weight-bold'>
                                                                                €{dats.price_plan / 12} / Month
                                                                            </h5>
                                                                        ) : (
                                                                            <h5 className='font-weight-bold'>€{dats.price_plan} / {dats.month_plan > 1 ? dats.month_plan : ''} Month</h5>
                                                                        )
                                                                    }
                                                                    <p>{dats.subname_plan}</p>
                                                                    {
                                                                        dats.is_free === '0' ? (
                                                                            <>
                                                                                <div className='mt-3 mb-2'>
                                                                                    <button disabled={dats.status_plan === '0'} onClick={() => this._submitTrx(dats.id_plan)} className='btn btn-lg btn-outline-primary font-weight-bold'>
                                                                                        PURCHASE
                                                                                    </button>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div className='btn btn-lg btn-outline-primary font-weight-bold'>FREE</div>
                                                                        )
                                                                    }
                                                                </center>
                                                                <hr></hr>
                                                                <div className='mt-2'>
                                                                    <iframe title="Features" height={250} style={{ borderWidth: 0 }} width={'100%'} srcDoc={dats.desc_plan}></iframe>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
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

export default Upgrade
