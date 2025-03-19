import { reactLocalStorage } from 'reactjs-localstorage';
import config from './config';

const destroy = () => {
    let endpoint = 'LOGOUT';
    let datas = reactLocalStorage.get('credential');
    let dataUser = datas ? JSON.parse(datas) : {};
   
    let API = config.API_URL + config.API_DEFINITION[endpoint].ENDPOINT;
    let requestObject = {
        method: config.API_DEFINITION[endpoint].METHOD,
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    };
    let tmpRequest = {
        user_id: dataUser.id_user
    };
    requestObject.body = JSON.stringify(tmpRequest);
    fetch(API, requestObject).then((response) => 
        response.json()).then((json) => {
            out();
        }).catch((err) => {
            out();
        })
    .catch((err) => {
        out();
    })
};

const out = () => {
    reactLocalStorage.set('is_exp', 'true');
    reactLocalStorage.remove('islogin');
    reactLocalStorage.remove('credential');
    reactLocalStorage.remove('jwt_token');
    reactLocalStorage.remove('tmpData-search');
    reactLocalStorage.remove('tmpData-recommended');
    reactLocalStorage.remove('tmpData-user');
    reactLocalStorage.remove('tmpData-iguser');

    reactLocalStorage.remove('tmpReq-search');
    reactLocalStorage.remove('tmpReq-recommended');
    reactLocalStorage.remove('tmpReq-user');
    reactLocalStorage.remove('tmpReq-iguser');
    reactLocalStorage.remove('tmpData-igfinduser');
    reactLocalStorage.remove('tmpReq-igfinduser');
    reactLocalStorage.remove('tmpData-tiktokdetail');
    reactLocalStorage.remove('tmpReq-tiktokdetail');

    reactLocalStorage.remove('tmpData-textai');
    reactLocalStorage.remove('tmpData-resultai');
    reactLocalStorage.remove('tmpData-tiktokhashtag');
    reactLocalStorage.remove('tmpReq-tiktokhashtag');

    reactLocalStorage.remove('tmpData-igdetail');
    reactLocalStorage.remove('tmpReq-igdetail');
    
    window.location.assign('/login');
}

const fetchingData = (endpoint, data) => {
    return new Promise((resolve, reject) => {
        let API = config.API_URL + config.API_DEFINITION[endpoint].ENDPOINT;
        let jwt = '';
        if (endpoint !== 'LOGIN' && endpoint !== 'LOGIN_GOOGLE' && endpoint !== 'REGISTER'
        && endpoint !== 'FORGOT_PASSWORD') {
            jwt = reactLocalStorage.get('jwt_token');
            if (!jwt) {
                destroy();
            }
        }
        let requestObject = {
            method: config.API_DEFINITION[endpoint].METHOD,
            headers: new Headers({
                'Authorization': 'Bearer ' + jwt,
                'Content-Type': 'application/json'
            }),
        }
        if (config.API_DEFINITION[endpoint].METHOD === 'GET') {
            API = API + data;
            console.log("APi : ", API);
            fetch(API).then((json) => {
                let tmpResult = json;
                resolve(tmpResult);
            }).catch((err) => {
                console.log("err : ", err);
                reject(err);
            })
        } else {
            requestObject.body = JSON.stringify(data);
            fetch(API, requestObject).then((response) => 
                response.json()).then((json) => {
                 
                    if (json.status) {
                        if (json.status === 'Expired token') {
                            out();
                        } else {
                            let tmpResult = json;
                            tmpResult.code = json.code.toString();
                            if (tmpResult.code === '200' || tmpResult.code === '201' || tmpResult.code === '301' 
                            || tmpResult.code === '302'  || tmpResult.code === '303' || tmpResult.code === '305' ||
                                tmpResult.code === '404' || tmpResult.code === '501') {
                                resolve(tmpResult);
                            } else {
                                reject('error 1');
                            }
                        }
                    } else {
                        let tmpResult = json;
                        tmpResult.code = json.code.toString();
                        if (tmpResult.code === '200' || tmpResult.code === '201' || tmpResult.code === '301' || tmpResult.code === '302' 
                        || tmpResult.code === '303' || tmpResult.code === '305' ||
                            tmpResult.code === '404' || tmpResult.code === '501') {
                            resolve(tmpResult);
                        } else {
                            reject('error 2');
                        }
                    }
                })
                .catch((err) => {
                    console.log("err : ", err);
                    reject(err);
                })
                .catch((err) => {
                    console.log("err : ", err);
                    reject(err);
                })
        }
    })
}



const apiService = {
    invoke(endpoint, data, success, error) {
        prepareFetch(endpoint, data, success, error);
    }
}

const prepareFetch = (endpoint, data, success, error) => {
    fetchingData(endpoint, data).then((responseFetch) => {
        success(responseFetch);
    }, (errFetch) => {
        error(errFetch);
    })

}

export default apiService;