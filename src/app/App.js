import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import { withTranslation } from "react-i18next";
import { reactLocalStorage } from 'reactjs-localstorage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';
import LoadingOverlay from 'react-loading-overlay';
import { GoogleOAuthProvider } from '@react-oauth/google';
import common from '../utils/common';
import axios from 'axios'

class App extends Component {
   constructor(props) {
      super(props)
      this.state = {
         warningTime: 1000 * 60 * 10,
         signoutTime: 1000 * 60 * 15,
         greeting: '',
         dataUser: {},
         isLogin: false,
         absens: false,
         memberData: {},
         absenData: {},
         totalBalance: '0',
         loading: false,
         dataBranch: {},
      }
   }

   componentDidMount() {
      if (this.props.location.pathname === '/register') {
         this._goto('/register')
      } else {
         let datacred = reactLocalStorage.get('credential')
         if (datacred) {
            this.setState(
               {
                  dataUser: JSON.parse(datacred),
                  isLogin: true,
               },
               () => {}
            )
         } else {
            this._goto('/login')
         }
         this.onRouteChanged()
      }

      document.addEventListener('keydown', this.listener)
   }

   logout() {
      this.destroy()
   }

   destroy = () => {
      clearInterval()
      //clear the session
      reactLocalStorage.remove('islogin')
      reactLocalStorage.remove('credential')
      reactLocalStorage.remove('jwt_token')
      reactLocalStorage.remove('tmpData-search')
      reactLocalStorage.remove('tmpData-recommended')
      reactLocalStorage.remove('tmpData-user')
      reactLocalStorage.remove('tmpData-iguser')
      reactLocalStorage.remove('tmpReq-search')
      reactLocalStorage.remove('tmpReq-recommended')
      reactLocalStorage.remove('tmpReq-user')
      reactLocalStorage.remove('tmpReq-iguser')
      reactLocalStorage.remove('tmpData-igfinduser')
      reactLocalStorage.remove('tmpReq-igfinduser')
      reactLocalStorage.remove('tmpData-tiktokdetail')
      reactLocalStorage.remove('tmpReq-tiktokdetail')
      reactLocalStorage.remove('tmpData-textai')
      reactLocalStorage.remove('tmpData-resultai')
      reactLocalStorage.remove('tmpData-tiktokhashtag')
      reactLocalStorage.remove('tmpReq-tiktokhashtag')

      reactLocalStorage.remove('tmpData-igdetail')
      reactLocalStorage.remove('tmpReq-igdetail')

      this.setState({ isLogin: false }, () => {
         window.location.assign('/login')
      })
   }
   _goto(v, params) {
      this.props.history.push(v, params)
   }

   _renderPageName() {
      let page = this.props.location.pathname;
      const { pathname } = this.props.location;

    const pathSegments = pathname.split('/');

    const secondSegment = pathSegments[1];
      if (page === '/dashboard') {
         return (
            <>
               <i className='mdi mdi-dashboard'></i>
               <span>Julya.IO Dashboard</span>
            </>
         )
      } else if (page === '/usertiktok') {
         return (
            <>
               <img
                  alt='tiktok'
                  src={require('../assets/images/tiktok2.png')}
                  width={35}
               />
               <span className='ml-2'>Track Competitors</span>
            </>
         )
      } else if (page === '/searchtiktok') {
         return (
            <>
               <img
                  alt='tiktok'
                  src={require('../assets/images/tiktok2.png')}
                  width={35}
               />
               <span className='ml-2'>Search Content</span>
            </>
         )
      } else if (page === '/hashtagtiktok') {
         return (
            <>
               <img
                  alt='tiktok'
                  src={require('../assets/images/tiktok2.png')}
                  width={35}
               />
               <span className='ml-2'>Hashtag Search</span>
            </>
         )
      } else if (page === '/tiktok') {
         return (
            <>
               <img
                  alt='tiktok'
                  src={require('../assets/images/tiktok2.png')}
                  width={35}
               />
               <span className='ml-2'>For You Page</span>
            </>
         )
      } else if (page === '/transcripttiktok') {
         return (
            <>
               <img
                  alt='tiktok'
                  src={require('../assets/images/tiktok2.png')}
                  width={35}
               />
               <span className='ml-2'>Transcript</span>
            </>
         )
      } else if (page === '/transcriptig') {
         return (
            <>
               <img
                  alt='tiktok'
                  src={require('../assets/images/ig.png')}
                  width={35}
               />
               <span className='ml-2'>Transcript</span>
            </>
         )
      } else if (page === '/igpost') {
         return (
            <>
               <img
                  alt='instagram'
                  src={require('../assets/images/ig.png')}
                  width={35}
               />
               <span className='ml-2'>Instagram Posts</span>
            </>
         )
      } else if (page === '/igreels') {
         return 'Instagram Reels'
      } else if (page === '/iguser') {
         return (
            <>
               <img
                  alt='instagram'
                  src={require('../assets/images/ig.png')}
                  width={35}
               />
               <span className='ml-2'>User Profile</span>
            </>
         )
      } else if (page === '/igfinduser') {
         return (
            <>
               <img
                  alt='instagram'
                  src={require('../assets/images/ig.png')}
                  width={35}
               />
               <span className='ml-2'>Search User</span>
            </>
         )
      } else if (page === '/ighashtag') {
         return (
            <>
               <img
                  alt='instagram'
                  src={require('../assets/images/ig.png')}
                  width={35}
               />
               <span className='ml-2'>Search Hashtag</span>
            </>
         )
      } else if (page === '/fbpost') {
         return 'Facebook Posts'
      } else if (page === '/fbreels') {
         return 'Facebook Reels'
      } else if (page === '/comingsoon') {
         return 'Coming Soon'
      } else if (page === '/detail') {
         return 'Content Detail'
      } else if (page === '/saved') {
         return 'Saved Content'
      } else if (page === '/profile') {
         return 'Profile Account'
      } else if (page === '/changepassword') {
         return 'Change Password'
      } else if (page === '/upgrade') {
         return 'Purchase Plan'
      } else if (page === '/upload' || page === '/project' || secondSegment === 'videosubtitle') {
         return 'Julya Video Subtitle'
      }else if (page === '/aijulya') {
         return (
            <>
               <img
                  alt='instagram'
                  src={require('../assets/images/ai.png')}
                  width={35}
               />
               <span className='ml-2'>Julya AI</span>
            </>
         )
      } else {
         return ''
      }
   }
   render() {
      let userData = this.state.dataUser
      let navbarComponent = !this.state.isFullPageLayout ? (
         <Navbar
            dataBranch={this.state.dataBranch}
            history={this.props.history}
            i18n={this.props.i18n}
            logout={() => this.logout()}
         />
      ) : (
         ''
      )
      let sidebarComponent = !this.state.isFullPageLayout ? (
         <Sidebar
            dataBranch={this.state.dataBranch}
            i18n={this.props.i18n}
            totalBalance={this.state.totalBalance}
         />
      ) : (
         ''
      )

      return (
         <div>
            <GoogleOAuthProvider clientId='657166259863-3vi4f4sa42n97vkbsfhqc0cjteuiu4c1.apps.googleusercontent.com'>
               <ToastContainer
                  position='bottom-right'
                  autoClose={7000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme='light'
               />
               <LoadingOverlay
                  active={this.state.loading}
                  spinner
                  text='Processing Data...'
               >
                  <div className='container-scroller'>
                     {sidebarComponent}
                     <div className='container-fluid page-body-wrapper'>
                        {navbarComponent}
                        <div className='main-panel'>
                           <div className='content-wrapper'>
                              {!this.state.isFullPageLayout ? (
                                 <div className='text-black mb-3'>
                                    <div className='row'>
                                       <div className='col'>
                                          <h2 className='font-weight-200 text-primary'>
                                             {this._renderPageName()}
                                          </h2>
                                       </div>
                                       <div className='col-auto'>
                                          <Link
                                             to='/profile'
                                             className='bg-primary text-light font-weight-bold p-2'
                                             style={{
                                                borderRadius: 8,
                                                boxShadow:
                                                   '5px 5px 5px lightblue',
                                             }}
                                          >
                                             <span> {userData.name_plan} </span>{' '}
                                             ({' '}
                                             {userData.is_expire === '1'
                                                ? 'Expired'
                                                : common.dateFormatNoDays(
                                                     userData.exp_date
                                                  )}{' '}
                                             )
                                          </Link>
                                       </div>
                                    </div>
                                 </div>
                              ) : null}
                              <AppRoutes />
                           </div>
                        </div>
                     </div>
                  </div>
               </LoadingOverlay>
            </GoogleOAuthProvider>
         </div>
      )
   }

   componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
         this.onRouteChanged()
      }
   }

   onRouteChanged() {
      axios.defaults.baseURL = 'https://api.julya.io/'
      window.scrollTo(0, 0)
      const fullPageLayoutRoutes = [
         '/login',
         '/forgotpassword',
         '/resetpassword',
         '/register',
      ]
      for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
         if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
            this.setState({
               isFullPageLayout: true,
            })
            document
               .querySelector('.page-body-wrapper')
               .classList.add('full-page-wrapper')
            break
         } else {
            this.setState({
               isFullPageLayout: false,
            })
            document
               .querySelector('.page-body-wrapper')
               .classList.remove('full-page-wrapper')
         }
      }
   }
}

export default withTranslation()(withRouter(App));
