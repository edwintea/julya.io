import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const Tiktok = lazy(() => import('./container/tiktok'));
const TiktokUser = lazy(() => import('./container/tiktokuser'));
const TiktokSearch = lazy(() => import('./container/tiktoksearch'));
const TiktokHashtag = lazy(() => import('./container/tiktokhashtag'));
const TiktokTranscript = lazy(() => import('./container/tiktoktranscript'));
const IgTranscript = lazy(() => import('./container/igtranscript'));

const Igpost = lazy(() => import('./container/igpost'));
const Iguser = lazy(() => import('./container/iguser'));
const Igfinduser = lazy(() => import('./container/igfinduser'));
const IgHashtag = lazy(() => import('./container/ighashtag'));
const IgStory = lazy(() => import('./container/igstory'));

const detailContainer = lazy(() => import('./container/detail'));
const SavedContent = lazy(() => import('./container/savedcontent'));

const AiJulya = lazy(() => import('./container/aijulya'));


const Profile = lazy(() => import('./settings/user'));
const ChangePassword = lazy(() => import('./settings/changepassword'));
const Upgrade = lazy(() => import('./settings/upgrade'));

// const userData = lazy(() => import('./user/data'));
// const addUser = lazy(() => import('./user/add'));
// const editUser = lazy(() => import('./user/edit'));

const Login = lazy(() => import('./auth/Login'));
const Register = lazy(() => import('./auth/Register'));
const Forgotpassword = lazy(() => import('./auth/Forgotpassword'));

const ProjectList = lazy(() => import('./container/projectlist'))
const videoSubtitle = lazy(() => import('./container/videosubtitle'));
const uploadVideo = lazy(() => import('./container/uploadvideo'))

class AppRoutes extends Component {
   render() {
      return (
         <Suspense fallback={<Spinner />}>
            <Switch>
               <Route path='/login' component={Login} />
               <Route path='/register' component={Register} />
               <Route path='/forgotpassword' component={Forgotpassword} />
               <Route path='/dashboard' component={Dashboard} />
               <Route path='/tiktok' component={Tiktok} />
               <Route path='/usertiktok' component={TiktokUser} />
               <Route path='/searchtiktok' component={TiktokSearch} />
               <Route path='/hashtagtiktok' component={TiktokHashtag} />
               <Route path='/transcripttiktok' component={TiktokTranscript} />
               <Route path='/transcriptig' component={IgTranscript} />
               <Route path='/igfinduser' component={Igfinduser} />
               <Route path='/iguser' component={Iguser} />
               <Route path='/igstory' component={IgStory} />
               <Route path='/ighashtag' component={IgHashtag} />
               <Route path='/profile' component={Profile} />
               <Route path='/changepassword' component={ChangePassword} />
               <Route path='/upgrade' component={Upgrade} />
               <Route path='/comingsoon' component={Igpost} />
               <Route path='/detail' component={detailContainer} />
               <Route path='/saved' component={SavedContent} />
               <Route path='/aijulya' component={AiJulya} />
               <Route path='/project' component={ProjectList} />
               <Route path='/upload' component={uploadVideo} />
               <Route path='/videosubtitle/:id' component={videoSubtitle} />
               <Redirect to='/dashboard' />
            </Switch>
         </Suspense>
      )
   }
}

export default AppRoutes;