/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import { reactLocalStorage } from 'reactjs-localstorage'
import common from '../../utils/common'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
   <a
      ref={ref}
      onClick={(e) => {
         e.preventDefault()
         onClick(e)
      }}
   >
      {children}
   </a>
))

const ProjectList = () => {
   let userDatas = reactLocalStorage.get('credential')
   const { id_user } = JSON.parse(userDatas)

   const [projects, setProjects] = useState([])

   const getDataProjectList = async () => {
      const newBody = {
         all: false,
         userId: id_user,
         status: 1,
         duration: '', // >=
         size: '', //9.840497 OR 1.570024 >=
         orderBy: 'duration', //size & duration
      }
      try {
         const res = await axios.post('api/v1/auth/video_user', newBody)
         if (res.status === 202) {
            setProjects(res.data.data)
         }
      } catch (error) {
         toast.error('Something went wrong, please reload page!')
      }
   }

   useEffect(() => {
      getDataProjectList()
   }, [])

   const handleDelete = async (id) => {
      try {
         await axios.post('api/v1/auth/video/delete', {
            id_video: id,
         })
         toast.success('Video deleted successfully!')
         getDataProjectList()
      } catch (error) {
         toast.error('Something went wrong, please reload page!')
      }
   }
   return (
      <div style={{ height: '100%' }}>
         <div
            className='row'
            style={{ display: 'flex', justifyContent: 'center' }}
         >
            <div className='col-md-12 mb-3'>
               <div className='card'>
                  <div className='card-header text-primary'>
                     <div className='row'>
                        <div className='col'>
                           <h4>My Projects</h4>
                        </div>
                        <div className='col-auto'>
                           <Link
                              to='/upload'
                              className='btn btn-primary btn-icon-split'
                           >
                              <span className='text'>
                                 <i className='mdi mdi-plus'></i> New Project
                              </span>
                           </Link>
                        </div>
                     </div>
                  </div>
                  <div className=''>
                     <table className='table table-project-list table-hover'>
                        <thead>
                           <tr>
                              <th scope='col'>No</th>
                              <th scope='col'>Name</th>
                              <th scope='col'>Created</th>
                              <th scope='col'>Duration (S)</th>
                              <th scope='col'>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {projects &&
                              projects.map((item, i) => (
                                 <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td style={{ fontWeight: '600' }}>
                                       <img
                                          src={item.video_thumb}
                                          style={{
                                             height: '100px',
                                             width: '100px',
                                             backgroundSize: 'cover',
                                             backgroundPosition: 'center',
                                             borderRadius: '5px',
                                             marginRight: '9px',
                                          }}
                                       />
                                       {item.video_title
                                          ? item.video_title
                                          : item.id_video}
                                    </td>
                                    <td>
                                       {common.dateFormatEnglish(
                                          item.createdAt
                                       )}
                                    </td>
                                    <td>{item.video_duration}</td>
                                    <td style={{ gap: '5px' }}>
                                       <div
                                          className='row'
                                          style={{ columnGap: '5px' }}
                                       >
                                          <Link
                                             to={`/videosubtitle/${item.id_video}`}
                                          >
                                             <button className='button-action-project-list'>
                                                <svg
                                                   xmlns='http://www.w3.org/2000/svg'
                                                   fill='none'
                                                   viewBox='0 0 24 24'
                                                   strokeWidth='1.5'
                                                   stroke='currentColor'
                                                   aria-hidden='true'
                                                   className='h-5 w-5'
                                                   height={23}
                                                   width={23}
                                                >
                                                   <path
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
                                                   ></path>
                                                </svg>
                                             </button>
                                          </Link>
                                          <button className='button-action-project-list'>
                                             <Dropdown>
                                                <Dropdown.Toggle
                                                   as={CustomToggle}
                                                   id='dropdown-button-drop-up'
                                                >
                                                   <svg
                                                      xmlns='http://www.w3.org/2000/svg'
                                                      fill='none'
                                                      viewBox='0 0 24 24'
                                                      strokeWidth='1.5'
                                                      stroke='currentColor'
                                                      aria-hidden='true'
                                                      className='h-5 w-5'
                                                      height={25}
                                                      width={25}
                                                   >
                                                      <path
                                                         strokeLinecap='round'
                                                         strokeLinejoin='round'
                                                         d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                                                      ></path>
                                                   </svg>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                   <Dropdown.Item
                                                      onClick={() =>
                                                         handleDelete(
                                                            item.id_video
                                                         )
                                                      }
                                                   >
                                                      Delete
                                                   </Dropdown.Item>
                                                </Dropdown.Menu>
                                             </Dropdown>
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ProjectList
