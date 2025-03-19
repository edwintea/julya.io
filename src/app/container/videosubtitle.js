/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Loading from 'react-fullscreen-loading'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { reactLocalStorage } from 'reactjs-localstorage'
import StyleSection from '../component/VideoSubtitle/StyleSection'
import BarLoader from 'react-spinners/BarLoader'
import CaptionSection from '../component/VideoSubtitle/CaptionSection'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import axios from 'axios'

const themesData = [
   {
      id: 1,
      themeName: 'BEAST',
      config: {
         fontFamily: 'KOMTITP',
         fontSize: 30,
         rotate: true,
         boxShadow: null,
         transition: null,
         padding: null,
         borderRadius: null,
      },
      configChild: {
         color: '#FFFFFF',
         textShadow:
            '0 0 2px #268aed,0 0 3px #268aed,0 0 4px #268aed,0 0 5px #268aed,0 0 6px #268aed,0 0 7px #268aed,0 0 8px #268aed,0 0 9px #268aed,0 0 10px #268aed,0 0 11px #268aed',
         WebkitTextStroke: '1.4px #000000',
      },
      highlight_color: {
         mainColor: '#268aed',
         secondColor: '#2ec9f0',
         thirdColor: '#e04fde',
      },
   },
   {
      id: 2,
      themeName: 'MONSTER',
      config: {
         fontFamily: 'Montserrat',
         fontSize: 30,
         rotate: false,
         boxShadow: 'inset 0px 0px 43px 187px rgba(0, 0, 0, 0.3)',
         transition: null,
         padding: '5px 10px 10px 8px',
         borderRadius: null,
      },
      configChild: {
         color: '#FFFFFF',
         textShadow: '0 0 2px #0FEBC5,0 0 3px #0FEBC5,0 0 4px #0FEBC5',
         WebkitTextStroke: null,
      },
      highlight_color: {
         mainColor: '#0FEBC5',
         secondColor: '#FFFFFF',
         thirdColor: '#FFFFFF',
      },
   },
   {
      id: 3,
      themeName: 'DOODLE',
      config: {
         fontFamily: 'Doodle',
         fontSize: 30,
         rotate: false,
         boxShadow: null,
         transition: 'transform 0.5s ease-in-out',
         padding: null,
         borderRadius: null,
      },
      configChild: {
         color: '#FFEB00',
         textShadow: null,
         WebkitTextStroke: null,
      },
      highlight_color: {
         mainColor: '#FFFFFF',
         secondColor: '#FFFFFF',
         thirdColor: '#FFFFFF',
      },
   },
   {
      id: 4,
      themeName: 'NOAH',
      config: {
         fontFamily: 'sans-serif',
         fontSize: 30,
         rotate: false,
         transition: null,
         boxShadow: null,
         padding: null,
         borderRadius: null,
      },
      configChild: {
         color: null,
         textShadow: null,
         WebkitTextStroke: null,
      },
      highlight_color: {
         mainColor: '#FFFFFF',
         secondColor: '#FFFFFF',
         thirdColor: '#FFFFFF',
      },
   },
   {
      /*
      NEW TEMPLATE 
      AUTHOR:EDWIN
      */
      id: 5,
      themeName: 'HORMOZI 2',
      config: {
         fontFamily: 'Montserrat',
         fontSize: 30,
         //fontWeight:'bold',
         rotate: false,
         boxShadow: null,
         transition: null,
         padding: '10px 15px 15px 5px',
         borderRadius: null,
         textTransform:'capitalize'
      },
      configChild: {
         color: null,
         textTransform:'capitalize',
         textShadow:
            '0 0 2px #000000,0 0 3px #000000,0 0 4px #000000,0 0 5px #000000,0 0 6px #000000,0 0 7px #000000,0 0 8px #000000,0 0 9px #000000,0 0 10px #000000,0 0 11px #000000',
            WebkitTextStroke: '0.4px #000000',
      },
      highlight_color: {
         textTransform:'capitalize',
         mainColor: '#2BF82A',
         secondColor: '#FDFA14',
         thirdColor: '#F01916'
      },
   },
]

const VideoSubtitle = () => {
   const videoRef = useRef(null)
   const { id } = useParams()
   const videoId = id
   const [loading, setLoading] = React.useState(false)
   const [loadingGetDetail, setLoadingGetDetail] = React.useState(false)
   const [isErrorExported, setIsErrorExported] = React.useState(null)
   const [fontSize, setFontSize] = useState(30)
   const [positionY, setPositionY] = useState(45)
   const [selectedColor, setSelectedColor] = useState({
      color: '#FFFFFF',
      mainColor: '#53FF01',
      secondColor: '#FCFF00',
      thirdColor: '#FF0002',
   })
   const [colorPicker, setColorPicker] = useState({
      color: false,
      mainColor: false,
      secondColor: false,
      thirdColor: false,
   })
   const [displayedSentence, setDisplayedSentence] = useState([])
   const [findIndexPlaying, setFindIndexOnPlay] = useState(0)
   const [prosesData, setProsesData] = useState()
   const [responseDetail, setResponseDetail] = useState({})
   const [transition, setTransition] = useState(false)
   const [rotate, setRotate] = useState(0)
   const rotationSequence = [0, 5, 2, 0, -4, 7, 0, 4]
   const rotationIndexRef = React.useRef(0)

   useEffect(() => {
      const datacred = reactLocalStorage.get('credential')
      const islogin = reactLocalStorage.get('islogin')

      if (islogin !== 'true' && !datacred) {
         window.location.assign('/login')
      }
   }, [])

   const _handleChangeColor = (color) => {
      if (colorPicker.color) {
         setSelectedColor({ ...selectedColor, color: color.hex })
      } else if (colorPicker.mainColor) {
         setSelectedColor({ ...selectedColor, mainColor: color.hex })
      } else if (colorPicker.secondColor) {
         setSelectedColor({ ...selectedColor, secondColor: color.hex })
      } else if (colorPicker.thirdColor) {
         setSelectedColor({ ...selectedColor, thirdColor: color.hex })
      }
   }

   const _handleOpenColorPick = (type) => {
      if (type === 'color') {
         setColorPicker({ ...colorPicker, color: !colorPicker.color })
      } else if (type === 'mainColor') {
         setColorPicker({ ...colorPicker, mainColor: !colorPicker.mainColor })
      } else if (type === 'secondColor') {
         setColorPicker({
            ...colorPicker,
            secondColor: !colorPicker.secondColor,
         })
      } else if (type === 'thirdColor') {
         setColorPicker({ ...colorPicker, thirdColor: !colorPicker.thirdColor })
      }
   }

   const handleChangeFontSize = (e) => {
      setFontSize(e)
   }

   const handleChangePositionY = (e) => {
      setPositionY(e)
   }
   const handleStopFrom = (e) => {
      videoRef.current.currentTime = e
      videoRef.current.pause()
   }
   const getDetailVideo = async () => {
      setLoadingGetDetail(true)
      try {
         const res = await axios.post('api/v1/auth/video/detail', {
            id_video: videoId,
         })
         if (res.status === 200) {
            setLoadingGetDetail(false)
            setResponseDetail(res.data.data[0])
            setProsesData(res.data.data[0].video_content)
            videoRef.current.src = res.data.data[0]?.video_url
         }
      } catch (error) {
         setLoadingGetDetail(false)
         console.log(error)
      }
   }
   useEffect(() => {
      getDetailVideo()
   }, [])

   useEffect(() => {
      const video = videoRef.current
      const updateCurrentTime = () => {
         displaySentence(video.currentTime)
      }
      const displaySentence = (time) => {
         const sentence = prosesData?.find(
            (item) =>
               parseFloat(item.start_time) <= time &&
               parseFloat(item.end_time) >= time
         )

         const findIndexOnPlaying = prosesData?.findIndex(
            (item) =>
               parseFloat(item.start_time) <= time &&
               parseFloat(item.end_time) >= time
         )

         if (sentence) {
            setDisplayedSentence(sentence)
            setFindIndexOnPlay(findIndexOnPlaying)
         } else {
            setDisplayedSentence('')
            setFindIndexOnPlay(0)
         }
      }

      if (video) {
         video.addEventListener('timeupdate', updateCurrentTime)
         return () => {
            video.removeEventListener('timeupdate', updateCurrentTime)
         }
      }
   }, [prosesData])

   useEffect(() => {
      let timeoutId
      if (displayedSentence.rotate) {
         timeoutId = setTimeout(() => { }, 500)
         const nextRotation = rotationSequence[rotationIndexRef.current]
         setRotate(nextRotation)
         rotationIndexRef.current =
            (rotationIndexRef.current + 1) % rotationSequence.length
         return () => clearTimeout(timeoutId)
      }
      setRotate(0)
      if (displayedSentence.transition) {
         setTransition(true)
         timeoutId = setTimeout(() => {
            setTransition(false)
         }, 500)
         return () => clearTimeout(timeoutId)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [displayedSentence])

   const handleExport = async () => {
      setLoading(true)
      const newBody = {
         id_video: responseDetail.id_video,
         user_id: responseDetail.user_id,
         video_url: responseDetail.video_url,
         subtitle: prosesData,
      }
      try {
         const res = await axios.post('api/v1/auth/video/export', newBody)
         if (res.data.code === 200) {
            getDetailVideo()
            setLoading(false)
            let videoURL = res.data?.data?.video_url_last
            videoURL=videoURL!=null?videoURL:res.data?.data?.video_url
            
            const link = document.createElement('a')
            link.href = videoURL
            link.target = '_blank'
            link.setAttribute(
               'download',
               `${responseDetail?.video_title
                  ? responseDetail?.video_title
                  : 'video'
               }.mp4`
            )

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
         }
      } catch (error) {
         console.log(error)
         setIsErrorExported(error.message)
         setLoading(false)
      }
   }

   const handleSave = async (dir) => {
      setLoading(true)
      const newBody = {
         id_video: responseDetail.id_video,
         video_content: prosesData,
      }
      try {
         const res = await axios.post('api/v1/auth/video/save', newBody)
         if (res.data.code === 200) {
            setLoading(false)
            if (dir === 'project') {
               window.location.href = '/project';
            } else {
               toast.success('Video save successfully!');
            }
         }
      } catch (error) {
         toast.error('Something went wrong, please reload page!')
         setIsErrorExported(error.message)
         setLoading(false)
      }
   }

   return (
      <div
         style={{
            height: '100vh',
         }}
      >
         <Loading
            loading={loadingGetDetail}
            background='rgba(0, 0, 0, 0.3)'
            loaderColor='#0C329F'
         />
         <div className='row'>
            <div className='col-md-12 mb-3'>
               <div
                  className='card'
                  style={{
                     boxShadow: '5px 5px 5px lightblue',
                  }}
               >
                  <div className='p-3 row'>
                     <div className='col'>
                        <h5 className='text-primary'>Video Subtitle Editor</h5>

                     </div>
                     <div className='col-auto'>
                        <button
                           onClick={() => handleSave('project')}
                           className='btn btn-secondary mr-3'
                        >
                           <i className='mdi mdi-format-list-bulleted'></i> My Projects
                        </button>
                        <button
                           onClick={() => handleSave('')}
                           className='btn btn-info mr-3'
                        >
                           <i className='mdi mdi-content-save'></i> Save Project
                        </button>
                        <button
                           onClick={handleExport}
                           className='btn btn-primary'
                        >
                           <i className='mdi mdi-download'></i> Export Video
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className='row'>

            <div className='col-md-8'>
               <div className='card'>
                  <div
                     className='card-header text-primary'
                  >
                     <Tabs
                        defaultActiveKey='Style'
                        id='justify-tab-example'
                        justify
                        variant='pills'
                     >
                        <Tab
                           eventKey='Style'
                           title='Style'
                           as={'div'}
                           style={{ marginInline: '-20px' }}
                        >
                           <StyleSection
                              styleList={themesData}
                              prosesData={prosesData}
                              setProsesData={setProsesData}
                              setDisplayedSentence={setDisplayedSentence}
                              findIndexPlaying={findIndexPlaying}
                              _handleChangeColor={_handleChangeColor}
                              _handleOpenColorPick={_handleOpenColorPick}
                              colorPicker={colorPicker}
                              fontSize={fontSize}
                              setFontSize={setFontSize}
                              handleChangeFontSize={handleChangeFontSize}
                              handleChangePositionY={
                                 handleChangePositionY
                              }
                              positionY={positionY}
                              selectedColor={selectedColor}
                              setSelectedColor={setSelectedColor}
                           />
                        </Tab>
                        <Tab
                           eventKey='Captions'
                           title='Captions'
                           as={'div'}
                           style={{ marginInline: -20 }}
                        >
                           <CaptionSection
                              selectedColor={selectedColor}
                              prosesData={prosesData}
                              handleStopFrom={handleStopFrom}
                              setProsesData={setProsesData}
                              setDisplayedSentence={setDisplayedSentence}
                              fontSize={fontSize}
                              positionY={positionY}
                           />
                        </Tab>
                     </Tabs>
                  </div>


               </div>
            </div>
            <div className='col-md-4'>
               <div className='ml-2'>
                  {loading && (
                     <div
                        style={{
                           height: '650px',
                           backgroundColor: 'rgba(0, 0, 0, 0.5)',
                           borderRadius: '20px',
                           width: '368px',
                           zIndex: 10,
                           position: 'absolute',
                           display: 'flex',
                           justifyContent: 'center',
                           alignItems: 'center',
                        }}
                     >
                        <div
                           style={{
                              height: '650px',
                              borderRadius: '20px',
                              width: '368px',
                              zIndex: 10,
                              position: 'absolute',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              top: -20,
                           }}
                        >
                           {isErrorExported === null ? (
                              'Processing...'
                           ) : (
                              <div
                                 style={{
                                    display: 'block',
                                    textAlign: 'center',
                                 }}
                              >
                                 <div>
                                    {' '}
                                    Sorry, something went wrong resulting in
                                    an error. Please contact the
                                    administrator for assistance. :(
                                 </div>
                                 <button
                                    style={{
                                       backgroundColor: 'white',
                                       borderRadius: '30px',
                                       border: '1px',
                                       paddingInline: '8px',
                                       marginTop: '10px',
                                    }}
                                 >
                                    Re-export
                                 </button>
                              </div>
                           )}
                        </div>
                        <BarLoader
                           color={'white'}
                           loading={true}
                           size={60}
                           height={5}
                        />
                     </div>
                  )}
                  <div >
                     <video
                        data-video={0}
                        ref={videoRef}
                        style={{
                           height: 650,
                           backgroundColor: 'none',
                           zIndex: 2,
                           borderRadius: '20px',
                           position: 'absolute',
                        }}
                        controls
                     ></video>

                     <div className='container-video'>
                        <div
                           style={{
                              position: 'absolute',
                              top: `${displayedSentence.positionY}vh`,
                              textAlign: 'center',
                              transform: `translate(-50%, ${transition ? '-120%' : '-50%'
                                 })`,
                              rotate: `${rotate}deg`,
                              transition: displayedSentence.transition,
                              margin: '30px',
                              fontSize: `${displayedSentence.fontSize}px`,
                              lineHeight:
                                 displayedSentence.fontSize > 35
                                    ? '43px'
                                    : '30px',
                              fontWeight: 'bold',
                              zIndex: 2,
                              boxShadow: displayedSentence.boxShadow,
                              padding: displayedSentence.padding,
                              borderRadius: displayedSentence.borderRadius,
                           }}
                        >
                           <div
                              style={{
                                 margin: 0,
                                 padding: 0,
                              }}
                           >
                              {displayedSentence?.emoji?.emoji}
                           </div>
                           {displayedSentence?.contentList?.map((row, i) => {
                              let res = row.content.replace(/#/g, "'")
                              return (
                                 <span
                                    key={i}
                                    style={{
                                       color: row.color,
                                       textShadow: row.textShadow,
                                       WebkitTextStroke:
                                          row.WebkitTextStroke,
                                       fontFamily:
                                          displayedSentence.fontFamily,
                                       width: '100%',
                                    }}
                                 >
                                    {res + ' '} {row.lineBreak && <br />}
                                 </span>
                              )
                           })}
                        </div>
                     </div>
                  </div>
               </div>


            </div>
         </div>
      </div>
   )
}

export default VideoSubtitle
