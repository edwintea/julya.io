import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import Select from 'react-select'
import BarLoader from 'react-spinners/BarLoader'
import { reactLocalStorage } from 'reactjs-localstorage'
import common from '../../utils/common'
import { toast } from 'react-toastify'

const baseStyle = {
   flex: 1,
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   padding: '20px',
   borderWidth: 2,
   borderRadius: 15,
   borderColor: '#eeeeee',
   borderStyle: 'dashed',
   backgroundColor: '#fafafa',
   color: '#bdbdbd',
   outline: 'none',
   transition: 'border .24s ease-in-out',
   height: '500px',
   width: '1000px',
   justifyContent: 'center',
}

const activeStyle = {
   borderColor: '#2196f3',
}

const acceptStyle = {
   borderColor: '#00e676',
}

const rejectStyle = {
   borderColor: '#ff1744',
}

const UploadVideo = () => {
   let userDatas = reactLocalStorage.get('credential')
   const { id_user } = JSON.parse(userDatas)
   const [videoUploaded, setVideoUploaded] = useState(null)
   const [videoErrorMessage, setVideoErrorMessage] = useState(false)
   const [isErrorUploaded, setIsErrorUploaded] = useState(null)
   const [errorForm, setErrorForm] = useState(false)
   const [isUploadVideo, setIsUploadVideo] = useState(false)
   const [videoPreview, setVideoPreview] = useState(null)
   const [title, setTitle] = useState(null)
   const [progress, setProgress] = React.useState(0)
   const [country, setCountry] = useState({
      country: null,
      emptyCountry: false,
      defaultValue: null,
   })

   const _onChangeName = (evt) => {
      let val = evt.target.value
      setTitle(val)
   }

   const onDrop = (acceptedFiles, fileRejections) => {
      if (fileRejections && fileRejections.length > 0) {
         setVideoErrorMessage(true)
      } else if (acceptedFiles.length > 0 && acceptedFiles[0]) {
         console.log("eccepted files : ", acceptedFiles);
         var fileSize = acceptedFiles[0].size; // in bytes
         var maxSizeInBytes = 40 * 1024 * 1024; // 40 MB
         if (fileSize > maxSizeInBytes) {
            toast.error("Video file size is 40mb maximum!");
         } else {
            setVideoPreview(URL.createObjectURL(acceptedFiles[0]))
            setVideoUploaded(acceptedFiles[0])
            setTitle(common.removeFileExtension(acceptedFiles[0].name))
            setVideoErrorMessage(false);
         }
      }
   }
   const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
   } = useDropzone({
      onDrop,
      multiple: false,
      accept: ['video/mp4'],
   })

   const style = useMemo(
      () => ({
         ...baseStyle,
         ...(isDragActive ? activeStyle : {}),
         ...(isDragAccept ? acceptStyle : {}),
         ...(isDragReject ? rejectStyle : {}),
      }),
      [isDragActive, isDragReject, isDragAccept]
   )
   const handleUpload = async () => {
      if (country.country !== null) {
         setIsUploadVideo(true)
         const formData = new FormData()
         formData.append('user_id', id_user)
         formData.append('file', videoUploaded)
         formData.append('video_title', title)
         formData.append('video_country', country.country)
         formData.append('thumbnail', 1)
         formData.append('watermark', 0)
         try {
            const res = await axios.post(
               'api/v1/auth/video/transcribe',
               formData,
               {
                  onUploadProgress(progressEvent) {
                     const { loaded, total } = progressEvent
                     let percent = Math.floor((loaded * 100) / total)
                     setProgress(percent)
                     if (percent === 100) {
                        console.log('Upload completed.')
                     }
                  },
               }
            )
            if (res.status === 200) {
               window.location.href = '/videosubtitle/' + res.data?.data?.id
            }
            setIsUploadVideo(false)
         } catch (error) {
            setIsErrorUploaded(error.message)
         }
      } else {
         setErrorForm(true);
      }
   }

   const handleReUpload = () => {
      setVideoUploaded(null)
      setIsErrorUploaded(null)
      setIsUploadVideo(false)
      setVideoPreview(null)
   }

   const handleFileUpload = (val) => {
      setCountry({
         country: val.value,
         emptyCountry: false,
         defaultValue: val,
      });
      setErrorForm(false);
   }

   return (
      <div className='row'>
         <div className='col-12'>


            <div className='row'>
               {videoPreview !== null && (
                  <div className='col-md-6'>
                     <div className='card'>
                        <div className='card-body'>
                           <div style={{ marginBottom: '30px' }}>
                              <div
                                 style={{
                                    fontSize: '25px',
                                    fontWeight: 'bold',
                                    color: '#2e1c5e',
                                 }}
                              >
                                 <span>Welcome to Julya Subtitle Editor</span>
                              </div>
                              <div style={{ color: 'gray' }}>
                                 <span>Preview your video & process the subtitle</span>
                              </div>
                           </div>
                           <div className='row'>
                              <div className='col-12'>
                                 <Form.Group className=''>
                                    <div className='input-group'>
                                       <div className='input-group-append'>
                                          <div
                                             className='input-group-text'
                                             style={{
                                                borderTopLeftRadius: 12,
                                                borderBottomLeftRadius: 12,
                                             }}
                                          >
                                             <span className='mdi mdi-information-outline'></span>
                                          </div>
                                       </div>
                                       <Form.Control
                                          value={title}
                                          type='text'
                                          onChange={(evt) => _onChangeName(evt)}
                                          placeholder="Project's Title..."
                                       />
                                    </div>
                                 </Form.Group>
                              </div>
                              <div className='col-12'>
                                 <Select
                                    placeholder={'Choose Country...'}
                                    onChange={(val) => handleFileUpload(val)}
                                    styles={{
                                       option: (base) => ({
                                          ...base,
                                          height: '100%',
                                          color: '#000',
                                       }),
                                    }}
                                    options={common.listCountryWithoutAll()}
                                    value={country.defaultValue}
                                 />
                                 <div
                                    style={{
                                       width: '100%',
                                       color: 'red',
                                       textAlign: 'left',
                                       marginTop: 5
                                    }}
                                 >
                                    {errorForm && <p>Please Select Country</p>}
                                 </div>
                              </div>
                              <div className='col-12'>
                                 <button
                                    onClick={handleUpload}
                                    className='btn btn-primary mt-3 w-100'
                                    style={{
                                       paddingBlock: '9px',
                                       paddingInline: '20px',
                                    }}
                                    disabled={isUploadVideo}
                                 >
                                    {isUploadVideo ? 'Processing...' : 'Upload & Process'}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>

               )}


               {videoPreview === null ? (
                  <div className='col-md-12'>
                     <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           fill='none'
                           viewBox='0 0 24 24'
                           strokeWidth='2'
                           stroke='#1f6d8c59'
                           aria-hidden='true'
                           className='w-5'
                           width='50'
                           height='50'
                        >
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
                           ></path>
                        </svg>
                        <span style={{ fontSize: '18px', color: '#1f6d8c59' }}>
                           Click or Drag/Drop to upload one or multiple videos at a
                           time
                        </span>
                        <span style={{ fontSize: '14px' }}>
                           MP4 formats accepted. Max width 1920 pixels. (Max 90s,
                           for now)
                        </span>
                        {videoErrorMessage && (
                           <span style={{ fontSize: '14px', color: 'red' }}>
                              Invalid file format only .mp4 files are allowed.
                           </span>
                        )}
                     </div>
                  </div>

               ) : (
                  <div className='col-md-6'>

                     <div
                        style={{
                           display: 'flex',
                           justifyContent: 'center',
                           alignItems: 'center',
                           position: 'relative',
                        }}
                     >
                        {isUploadVideo && (
                           <div
                              style={{
                                 height: '600px',
                                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                 borderRadius: '20px',
                                 width: '350px',
                                 zIndex: 10,
                                 position: 'absolute',
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                              }}
                           >
                              <div
                                 style={{
                                    height: '600px',
                                    borderRadius: '20px',
                                    width: '350px',
                                    zIndex: 10,
                                    position: 'absolute',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    top: -20,
                                 }}
                              >
                                 {isErrorUploaded === null ? (
                                    progress < 100 ? (
                                       progress + '%'
                                    ) : (
                                       'Processing...'
                                    )
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
                                          onClick={handleReUpload}
                                          style={{
                                             backgroundColor: 'white',
                                             borderRadius: '30px',
                                             border: '1px',
                                             padding: '5px',
                                             paddingInline: '8px',
                                             marginTop: '10px',
                                          }}
                                       >
                                          Re-upload
                                       </button>
                                    </div>
                                 )}
                              </div>
                              {isUploadVideo && isErrorUploaded === null && (
                                 <BarLoader
                                    color={'white'}
                                    loading={true}
                                    size={60}
                                    height={5}
                                 />
                              )}
                           </div>
                        )}

                        <video
                           data-video={0}
                           src={videoPreview}
                           style={{
                              height: '600px',
                              width: '350px',
                              objectFit: 'cover',
                              borderRadius: '20px',
                           }}
                           controls={true}
                        />
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default UploadVideo
