import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from 'react-fullscreen-loading';

class Instagram extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataUser: {},
      loadingDashboard: false,
      platforms: [
        {
          label: "TikTok",
          value: "tiktok"
        },
        {
          label: "Facebook",
          value: "fb"
        },
        {
          label: "Instagram",
          value: "instagram"
        },
        {
          label: "Pinterest",
          value: "pinterest"
        }
      ],
      period: [
        {
          label: "Last 24 Hours",
          value: "1"
        },
        {
          label: "This Week",
          value: "7"
        },
        {
          label: "This Month",
          value: "30"
        },
        {
          label: "Last 3 Months",
          value: "90"
        },
        {
          label: "Last 6 Months",
          value: "180"
        }
      ],
      days: "1",
      keyword: "",
      showData: [],
      data: [],
      emptyKeyword: false,
      country: ""
    }

  }

  timeout = 0;

  componentDidMount() {
    let datacred = reactLocalStorage.get('credential');
    let islogin = reactLocalStorage.get('islogin');

    if (islogin === 'true' && datacred) {
    } else {
      window.location.assign('/login');
    }

    this.setState({
      dataUser: JSON.parse(datacred),
    }, () => {
    });
  }

  _goto(v, param) {
    this.props.history.push(v, param);
  }

  _showLoading() {
    this.setState({ loadingDashboard: true })
  }
  _hideLoading() {
    this.setState({ loadingDashboard: false })
  }

  _comingSoon() {
    toast.warning("This feature is still under development, Stay Tuned!");
  }

  render() {
    const { loadingDashboard } = this.state;
    return (
      <div >
        <Loading loading={loadingDashboard} background="rgba(0, 0, 0, 0.3)" loaderColor="#0C329F" />

        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-body text-primary'>
                <div style={{ marginTop: '5%', marginBottom: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <center>
                    <img alt="notfound" src={require('../../assets/images/comingsoon.png')} width={250} />
                    <h2>Still under construction...<br></br><center><p className='mt-2'>Stay tuned, we're still cooking up the magic for you</p></center></h2>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default Instagram;