/* eslint-disable array-callback-return */
import EmojiPicker from 'emoji-picker-react'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const CaptionSection = ({
   prosesData,
   handleStopFrom,
   setProsesData,
   setDisplayedSentence,
   selectedColor,
   fontSize,
   positionY,
}) => {
   const [showEmojiPicker, setShowEmojiPicker] = useState(null)
   const [showEditBoard, setShowEditBoard] = useState(null)
   const [showEditRangeTime, setShowEditRangeTime] = useState(null)
   const [showPostitionYInCard, setShowPostitionYInCard] = useState(null)

   const [selectedItemKeyContentList, setSelectedItemKeyContentList] =
      useState(null)
   const [selectedCardEditor, setSelectedCardEditor] = useState(null)
   const [startEditItem, setNumberStartEdit] = useState(0)
   const [endEditItem, setNumberEndEdit] = useState(0)

   const _handleSelectedEmoji = async (emoji, index) => {
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      newItem['emoji'] = { ...newItem['emoji'], emoji: emoji.emoji }
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
      setShowEmojiPicker(null)
      setShowEditRangeTime(null)
      setShowEditBoard(null)
      setShowPostitionYInCard(null)
   }
   const _handleOpenEmojiPicker = (key, e) => {
      e.stopPropagation()
      setShowEmojiPicker(key)
      setShowEditRangeTime(null)
      setShowEditBoard(null)
      setShowPostitionYInCard(null)
      setSelectedCardEditor(key)
   }

   const _handleSelectedCardEditor = (key, e) => {
      e.stopPropagation()
      setSelectedCardEditor(key)
      setShowEditRangeTime(null)
      setShowEmojiPicker(null)
      setShowEditBoard(null)
      setShowPostitionYInCard(null)
   }
   const _handleChangeStartTime = (e) => {
      setNumberStartEdit(e)
   }
   const _handleChangeEndTime = (e) => {
      setNumberEndEdit(e)
   }

   const _handleEditRangeTime = (key, e) => {
      e.stopPropagation()
      setShowEditRangeTime(key)
      setShowEmojiPicker(null)
      setShowEditBoard(null)
      setShowPostitionYInCard(null)
      setSelectedCardEditor(key)
   }

   const _handleOpenEditPosition = (key, e) => {
      e.stopPropagation()
      setShowEditBoard(key)
      setShowEditRangeTime(null)
      setShowEmojiPicker(null)
      setShowPostitionYInCard(null)
      setSelectedCardEditor(key)
   }

   const _handlePositionYInCard = (key, e) => {
      e.stopPropagation()
      setShowPostitionYInCard(key)
      setShowEditBoard(null)
      setShowEditRangeTime(null)
      setShowEmojiPicker(null)
      setSelectedCardEditor(key)
   }

   const _handleResetSize = (index, e) => {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      newItem['fontSize'] = fontSize
      newItem['selectedSize'] = null
      newItem['positionY'] = positionY
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])

      setShowEditBoard(null)
      setShowEditRangeTime(null)
      setShowEmojiPicker(null)
   }

   function updateTranscriptionItem(index, childKey, prop, ev) {
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      newItem.contentList[childKey][prop] = ev.target.value
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function updateTranscriptionColorItem(index, childKey, prop, ev, e) {
      e.stopPropagation()
      const newBeastTextShadow = `0 0 2px ${ev},0 0 3px ${ev},0 0 4px ${ev},0 0 5px ${ev},0 0 6px ${ev},0 0 7px ${ev},0 0 8px ${ev},0 0 9px ${ev},0 0 10px ${ev},0 0 11px ${ev}`
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      if (prop === 'color') {
         newItem.contentList[childKey][prop] = ev
      } else {
         newItem.contentList[childKey]['textShadow'] = newBeastTextShadow
      }
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function updateTranscriptionRangeTimeItem(index, e) {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      newItem['start_time'] = startEditItem.toString()
      newItem['end_time'] = endEditItem.toString()
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setNumberStartEdit(0)
      setNumberEndEdit(0)
      setShowEditRangeTime(null)
      setShowEmojiPicker(null)
      setShowEditBoard(null)
      setShowPostitionYInCard(null)
      setSelectedCardEditor(null)
   }
   function updateTranscriptionPositionYItem(index, e) {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      newItem['positionY'] = e.currentTarget.valueAsNumber
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function updateTranscriptionFontSizeItem(index, selectedSize) {
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      if (selectedSize === 'S') {
         newItem['fontSize'] = 20
         newItem['selectedSize'] = 'S'
      }
      if (selectedSize === 'M') {
         newItem['fontSize'] = 38
         newItem['selectedSize'] = 'M'
      }
      if (selectedSize === 'L') {
         newItem['fontSize'] = 48
         newItem['selectedSize'] = 'L'
      }
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])

      setShowEditBoard(null)
      setShowEditRangeTime(null)
      setShowEmojiPicker(null)
      setSelectedCardEditor(index)
   }

   function handleAddNewSentence(index, e) {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      const findTimeStart = newAwsItems[index].end_time
      const findTimeEnd = newAwsItems[index + 1].start_time
      const newData = {
         start_time: Number(findTimeStart) + 0.01,
         end_time: findTimeEnd,
         content: null,
         contentList: [
            {
               start_time: null,
               end_time: null,
               content: '',
               color: '#FFFFFF',
            },
         ],
         positionY: positionY,
         fontSize: fontSize,
         selectedSize: null,
      }
      newAwsItems.splice(index + 1, 0, newData)
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function handleDeleteSentence(index, e) {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      let indexToDelete = newAwsItems.findIndex((element, i) => i === index)
      newAwsItems.splice(indexToDelete, 1)
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function handelMoveToNextLine(index, e, childKey) {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      const currItem = { ...newAwsItems[index + 1] }
      const newData = newItem.contentList[childKey]
      const currData = currItem.contentList
      currData.splice(0, 0, newData)
      currItem.contentList = currData

      const findData = newItem.contentList.filter((row, i) => {
         if (i !== childKey) {
            return { row }
         }
      })
      newItem.contentList = findData

      newAwsItems[index + 1] = currItem
      newAwsItems[index] = newItem

      if (newItem.contentList.length === 0) {
         let indexToDelete = newAwsItems.findIndex((element, i) => i === index)
         newAwsItems.splice(indexToDelete, 1)
      }

      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function handelMoveToPrevLine(index, e, childKey) {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      const currItem = { ...newAwsItems[index - 1] }
      const newData = newItem.contentList[childKey]
      const currData = currItem.contentList
      currData.push(newData)
      currItem.contentList = currData

      const findData = newItem.contentList.filter((row, i) => {
         if (i !== childKey) {
            return { row }
         }
      })
      newItem.contentList = findData

      newAwsItems[index - 1] = currItem
      newAwsItems[index] = newItem

      if (newItem.contentList.length === 0) {
         let indexToDelete = newAwsItems.findIndex((element, i) => i === index)
         newAwsItems.splice(indexToDelete, 1)
      }

      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function handleAddWord(index, e, childKey) {
      e.stopPropagation()
      const dataObject = {
         start_time: null,
         end_time: null,
         content: '',
         color: '#FFFFFF',
      }
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      const currData = newItem.contentList
      currData.splice(childKey + 1, 0, dataObject)
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])

      setSelectedItemKeyContentList(childKey + 1)
      setShowEditBoard(index)
      setSelectedCardEditor(index)
   }

   function handleDeleteWord(index, e, childKey) {
      e.stopPropagation()

      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }

      let indexToDelete = newItem?.contentList?.findIndex(
         (element, i) => i === childKey
      )
      newItem.contentList.splice(indexToDelete, 1)

      if (newItem.contentList.length === 0) {
         let indexToDelete = newAwsItems.findIndex((element, i) => i === index)
         newAwsItems.splice(indexToDelete, 1)
      }
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
   }

   function handleAddLineBreak(index, childKey, prop, e) {
      e.stopPropagation()
      const newAwsItems = [...prosesData]
      const newItem = { ...newAwsItems[index] }
      newItem.contentList[childKey][prop] = newItem.contentList[childKey][prop]
         ? false
         : true
      newAwsItems[index] = newItem
      setProsesData(newAwsItems)
      setDisplayedSentence(newAwsItems[index])
      setSelectedItemKeyContentList(childKey)
      setShowEditBoard(index)
      setSelectedCardEditor(index)
   }

   return (
      <div
         className='card-body'
         style={{
            marginLeft: '1px',
            overflow: 'scroll',
            height: '400px',
            scrollbarColor: 'red',
         }}
      >
         <div style={{ marginBottom: '10px' }}>
            <p
               style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginBottom: '5px',
               }}
            >
               Auto Generated Captions
            </p>
            <p
               style={{
                  fontSize: '18px',
                  margin: '0px',
                  fontFamily: 'sans-serif',
               }}
            >
               Included with auto emoji at each captions
            </p>
         </div>
         <div>
            {prosesData &&
               prosesData.map((item, key) => {
                  /* start time */
                  const startOriginalNumber = item.start_time
                  const decimalPlaces = 2

                  const startRoundedNumber =
                     Math.floor(
                        startOriginalNumber * Math.pow(10, decimalPlaces)
                     ) / Math.pow(10, decimalPlaces)
                  const startFormattedNumber =
                     startRoundedNumber.toFixed(decimalPlaces)
                  /* end time */
                  const endOriginalNumber = item.end_time

                  const endRoundedNumber =
                     Math.floor(
                        endOriginalNumber * Math.pow(10, decimalPlaces)
                     ) / Math.pow(10, decimalPlaces)
                  const endFormattedNumber =
                     endRoundedNumber.toFixed(decimalPlaces)

                  return (
                     <div
                        key={key}
                        className={`card-list-container ${
                           selectedCardEditor === key ? 'selected' : ''
                        }`}
                     >
                        <div
                           onClick={(e) => {
                              _handleSelectedCardEditor(key, e)
                              handleStopFrom(item.start_time)
                           }}
                           style={{ position: 'relative' }}
                        >
                           <div
                              style={{
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 paddingTop: '5px',
                              }}
                           >
                              <div>
                                 <div
                                    style={{
                                       display: 'flex',
                                       alignItems: 'center',
                                    }}
                                 >
                                    <div style={{ position: 'relative' }}>
                                       <button
                                          onClick={(e) => {
                                             _handleEditRangeTime(key, e)
                                             _handleChangeStartTime(
                                                startFormattedNumber
                                             )
                                             _handleChangeEndTime(
                                                endFormattedNumber
                                             )
                                             handleStopFrom(item.start_time)
                                          }}
                                          className={`button-set-time  ${
                                             showEditRangeTime === key &&
                                             selectedCardEditor === key
                                                ? 'isExpandedItem'
                                                : ''
                                          }`}
                                       >
                                          <div>
                                             {startFormattedNumber} -{' '}
                                             {endFormattedNumber}
                                          </div>
                                       </button>
                                       {showEditRangeTime === key &&
                                          selectedCardEditor === key && (
                                             <div
                                                className='expanded-card'
                                                onClick={(e) => {
                                                   _handleEditRangeTime(key, e)
                                                }}
                                             >
                                                <div>
                                                   <div>
                                                      <div>
                                                         <p htmlFor='start-range'>
                                                            Start time{' '}
                                                            {
                                                               startFormattedNumber
                                                            }
                                                         </p>
                                                      </div>
                                                      <input
                                                         type='number'
                                                         value={startEditItem}
                                                      />
                                                      <input
                                                         onChange={(e) => {
                                                            _handleChangeStartTime(
                                                               e.currentTarget
                                                                  .valueAsNumber
                                                            )
                                                         }}
                                                         id='default-range'
                                                         min={
                                                            startFormattedNumber
                                                         }
                                                         max={endEditItem}
                                                         step='0.01'
                                                         type='range'
                                                         name='top'
                                                         value={startEditItem}
                                                      />
                                                   </div>
                                                   <div>
                                                      <div>
                                                         <p htmlFor='end-range'>
                                                            End time{' '}
                                                            {endFormattedNumber}
                                                         </p>
                                                      </div>
                                                      <input
                                                         type='number'
                                                         value={endEditItem}
                                                      />
                                                      <input
                                                         onChange={(e) => {
                                                            _handleChangeEndTime(
                                                               e.currentTarget
                                                                  .valueAsNumber
                                                            )
                                                         }}
                                                         id='default-range'
                                                         min={startEditItem}
                                                         max={
                                                            endFormattedNumber
                                                         }
                                                         step='0.01'
                                                         type='range'
                                                         name='end'
                                                         value={endEditItem}
                                                      />
                                                   </div>
                                                   <div className='button'>
                                                      <button
                                                         onClick={(e) =>
                                                            _handleEditRangeTime(
                                                               null,
                                                               e
                                                            )
                                                         }
                                                         className='cancel'
                                                      >
                                                         Cancel
                                                      </button>
                                                      <button
                                                         className='save'
                                                         onClick={(e) => {
                                                            updateTranscriptionRangeTimeItem(
                                                               key,
                                                               e
                                                            )
                                                         }}
                                                      >
                                                         Save
                                                      </button>
                                                   </div>
                                                </div>
                                             </div>
                                          )}
                                    </div>
                                    <div
                                       style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                       }}
                                    >
                                       <div>
                                          <button
                                             className='btn btn-emoji-picker'
                                             onClick={(e) => {
                                                _handleOpenEmojiPicker(key, e)
                                                handleStopFrom(item.start_time)
                                             }}
                                          >
                                             {item?.emoji?.emoji ? (
                                                <p
                                                   style={{
                                                      fontSize: '25px',
                                                      margin: 0,
                                                   }}
                                                >
                                                   {item?.emoji?.emoji}
                                                </p>
                                             ) : (
                                                <span
                                                   className='mdi mdi-emoticon-outline'
                                                   style={{
                                                      color:
                                                         selectedCardEditor ===
                                                         key
                                                            ? '#FFFFFF'
                                                            : '#a5a0a0',
                                                      fontSize: '25px',
                                                   }}
                                                ></span>
                                             )}
                                          </button>
                                          {showEmojiPicker === key &&
                                             selectedCardEditor === key && (
                                                <div
                                                   style={{
                                                      position: 'absolute',
                                                      zIndex: '2',
                                                   }}
                                                >
                                                   <div
                                                      style={{
                                                         top: '0px',
                                                         right: '0px',
                                                         bottom: '0px',
                                                         left: '0px',
                                                      }}
                                                      onClick={(e) =>
                                                         _handleOpenEmojiPicker(
                                                            key,
                                                            e
                                                         )
                                                      }
                                                   />
                                                   <EmojiPicker
                                                      onEmojiClick={(emoji) =>
                                                         _handleSelectedEmoji(
                                                            emoji,
                                                            key
                                                         )
                                                      }
                                                   />
                                                </div>
                                             )}
                                       </div>
                                       <div style={{ marginLeft: '-10px' }}>
                                          <button className='btn'>
                                             <span
                                                className='mdi mdi-volume-high'
                                                style={{
                                                   color:
                                                      selectedCardEditor === key
                                                         ? '#FFFFFF'
                                                         : '#a5a0a0',
                                                   fontSize: '25px',
                                                }}
                                             ></span>
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              {selectedCardEditor === key && (
                                 <div>
                                    <div
                                       style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                       }}
                                    >
                                       <div style={{ marginLeft: '-13px' }}>
                                          <button
                                             onClick={(e) =>
                                                _handlePositionYInCard(key, e)
                                             }
                                             className='btn'
                                          >
                                             <span
                                                className='mdi mdi-swap-vertical'
                                                style={{
                                                   color: 'white',
                                                   fontSize: '25px',
                                                }}
                                             ></span>
                                          </button>
                                          {showPostitionYInCard === key &&
                                             selectedCardEditor === key && (
                                                <div
                                                   className='position-Y-card'
                                                   onClick={(e) =>
                                                      _handlePositionYInCard(
                                                         key,
                                                         e
                                                      )
                                                   }
                                                >
                                                   <Form.Group
                                                      style={{ width: '140px' }}
                                                   >
                                                      <label>Positon Y</label>
                                                      <div
                                                         style={{
                                                            width: '100%',
                                                         }}
                                                      >
                                                         <div className='input-group'>
                                                            <Form.Control
                                                               className={
                                                                  'border-primary'
                                                               }
                                                               type='text'
                                                               value={
                                                                  item.positionY
                                                               }
                                                               disabled
                                                            />
                                                            <div className='input-group-append'>
                                                               <div
                                                                  className='input-group-text'
                                                                  style={{
                                                                     borderTopRightRadius: 12,
                                                                     borderBottomRightRadius: 12,
                                                                  }}
                                                               >
                                                                  <span>%</span>
                                                               </div>
                                                            </div>
                                                         </div>
                                                      </div>
                                                      <div>
                                                         <input
                                                            onChange={(e) => {
                                                               updateTranscriptionPositionYItem(
                                                                  key,
                                                                  e
                                                               )
                                                            }}
                                                            id='default-range'
                                                            min={0}
                                                            max={50}
                                                            step='1'
                                                            type='range'
                                                            name='top'
                                                            value={
                                                               item.positionY
                                                            }
                                                            style={{
                                                               width: '100%',
                                                               marginTop:
                                                                  '10px',
                                                            }}
                                                         />
                                                      </div>
                                                      <div>
                                                         <label>Size</label>
                                                         <div className='selection-size'>
                                                            <div
                                                               onClick={(e) => {
                                                                  updateTranscriptionFontSizeItem(
                                                                     key,
                                                                     'S'
                                                                  )
                                                               }}
                                                               className={`small ${
                                                                  item.selectedSize ===
                                                                     'S' &&
                                                                  'small-selected'
                                                               }`}
                                                            >
                                                               S
                                                            </div>
                                                            <div
                                                               onClick={(e) => {
                                                                  updateTranscriptionFontSizeItem(
                                                                     key,
                                                                     'M'
                                                                  )
                                                               }}
                                                               className={`medium ${
                                                                  item.selectedSize ===
                                                                     'M' &&
                                                                  'medium-selected'
                                                               }`}
                                                            >
                                                               M
                                                            </div>
                                                            <div
                                                               onClick={(e) => {
                                                                  updateTranscriptionFontSizeItem(
                                                                     key,
                                                                     'L'
                                                                  )
                                                               }}
                                                               className={`large ${
                                                                  item.selectedSize ===
                                                                     'L' &&
                                                                  'large-selected'
                                                               }`}
                                                            >
                                                               L
                                                            </div>
                                                         </div>
                                                         <button
                                                            onClick={(e) =>
                                                               _handleResetSize(
                                                                  key,
                                                                  e
                                                               )
                                                            }
                                                            className='reset'
                                                         >
                                                            Reset
                                                         </button>
                                                      </div>
                                                   </Form.Group>
                                                </div>
                                             )}
                                       </div>
                                       <div style={{ marginLeft: '-13px' }}>
                                          <button
                                             className='btn'
                                             onClick={(e) =>
                                                handleAddNewSentence(key, e)
                                             }
                                          >
                                             <span
                                                className='mdi mdi-plus'
                                                style={{
                                                   color: 'white',
                                                   fontSize: '25px',
                                                }}
                                             ></span>
                                          </button>
                                       </div>
                                       <div style={{ marginLeft: '-13px' }}>
                                          <button
                                             onClick={(e) =>
                                                handleDeleteSentence(key, e)
                                             }
                                             className='btn'
                                          >
                                             <span
                                                className='mdi mdi-trash-can-outline'
                                                style={{
                                                   color: 'white',
                                                   fontSize: '25px',
                                                }}
                                             ></span>
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                           <div
                              style={{
                                 display: 'flex',
                                 justifyContent: 'start',
                                 paddingInline: '5px',
                                 paddingBottom: '15px',
                              }}
                           >
                              <div className='mt-3'>
                                 {selectedCardEditor === key &&
                                 showEditBoard === key
                                    ? item?.contentList &&
                                      item?.contentList.map((row, i) =>
                                         selectedItemKeyContentList === i ? (
                                            <React.Fragment key={i}>
                                               <input
                                                  className='update-sentence'
                                                  style={{
                                                     width:
                                                        row.content.length > 0
                                                           ? `${row.content.length}rem`
                                                           : '5rem',
                                                  }}
                                                  value={row.content}
                                                  onChange={(ev) =>
                                                     updateTranscriptionItem(
                                                        key,
                                                        i,
                                                        'content',
                                                        ev
                                                     )
                                                  }
                                                  onClick={(e) =>
                                                     e.stopPropagation()
                                                  }
                                               />
                                               {row.lineBreak && (
                                                  <span
                                                     className='mdi mdi-keyboard-space'
                                                     style={{
                                                        color: 'black',
                                                        fontSize: '18px',
                                                     }}
                                                  ></span>
                                               )}
                                               <div className='editable-space'>
                                                  <div>
                                                     <div
                                                        style={{
                                                           display: 'flex',
                                                           gap: '5px',
                                                           marginBottom: '10px',
                                                        }}
                                                     >
                                                        <button
                                                           onClick={(e) => {
                                                              updateTranscriptionColorItem(
                                                                 key,
                                                                 i,
                                                                 'color',
                                                                 selectedColor.color,
                                                                 e
                                                              )
                                                           }}
                                                           style={{
                                                              height: '25px',
                                                              width: '25px',
                                                              borderRadius:
                                                                 '40px',
                                                              border: 'solid',
                                                              background:
                                                                 selectedColor.color,
                                                              borderColor:
                                                                 '#e5e7eb',
                                                              borderWidth:
                                                                 '1px',
                                                           }}
                                                        />
                                                        <button
                                                           onClick={(e) => {
                                                              updateTranscriptionColorItem(
                                                                 key,
                                                                 i,
                                                                 'mainColor',
                                                                 selectedColor.mainColor,
                                                                 e
                                                              )
                                                           }}
                                                           style={{
                                                              height: '25px',
                                                              width: '25px',
                                                              borderRadius:
                                                                 '40px',
                                                              border: 'solid',
                                                              background:
                                                                 selectedColor.mainColor,
                                                              borderColor:
                                                                 '#e5e7eb',
                                                              borderWidth:
                                                                 '1px',
                                                           }}
                                                        />
                                                        <button
                                                           onClick={(e) => {
                                                              updateTranscriptionColorItem(
                                                                 key,
                                                                 i,
                                                                 'secondColor',
                                                                 selectedColor.secondColor,
                                                                 e
                                                              )
                                                           }}
                                                           style={{
                                                              height: '25px',
                                                              width: '25px',
                                                              borderRadius:
                                                                 '40px',
                                                              border: 'solid',
                                                              background:
                                                                 selectedColor.secondColor,
                                                              borderColor:
                                                                 '#e5e7eb',
                                                              borderWidth:
                                                                 '1px',
                                                           }}
                                                        />
                                                        <button
                                                           onClick={(e) => {
                                                              updateTranscriptionColorItem(
                                                                 key,
                                                                 i,
                                                                 'thirdColor',
                                                                 selectedColor.thirdColor,
                                                                 e
                                                              )
                                                           }}
                                                           style={{
                                                              height: '25px',
                                                              width: '25px',
                                                              borderRadius:
                                                                 '40px',
                                                              border: 'solid',
                                                              background:
                                                                 selectedColor.thirdColor,
                                                              borderColor:
                                                                 '#e5e7eb',
                                                              borderWidth:
                                                                 '1px',
                                                           }}
                                                        />
                                                     </div>
                                                     <div>
                                                        <div className='action-board-text'>
                                                           {i === 0 &&
                                                              key !== 0 && (
                                                                 <div
                                                                    onClick={(
                                                                       e
                                                                    ) =>
                                                                       handelMoveToPrevLine(
                                                                          key,
                                                                          e,
                                                                          i
                                                                       )
                                                                    }
                                                                 >
                                                                    <span
                                                                       className='mdi mdi-subdirectory-arrow-left'
                                                                       style={{
                                                                          color: 'black',
                                                                          fontSize:
                                                                             '18px',
                                                                       }}
                                                                    ></span>
                                                                    <span>
                                                                       Move to
                                                                       prev line
                                                                    </span>
                                                                 </div>
                                                              )}

                                                           <div
                                                              onClick={(e) =>
                                                                 handelMoveToNextLine(
                                                                    key,
                                                                    e,
                                                                    i
                                                                 )
                                                              }
                                                           >
                                                              <span
                                                                 className='mdi mdi-subdirectory-arrow-right'
                                                                 style={{
                                                                    color: 'black',
                                                                    fontSize:
                                                                       '18px',
                                                                 }}
                                                              ></span>
                                                              <span>
                                                                 Move to next
                                                                 line
                                                              </span>
                                                           </div>
                                                           {item?.contentList
                                                              ?.length > 1 && (
                                                              <div
                                                                 onClick={(
                                                                    e
                                                                 ) => {
                                                                    handleAddLineBreak(
                                                                       key,
                                                                       i,
                                                                       'lineBreak',
                                                                       e
                                                                    )
                                                                 }}
                                                              >
                                                                 <span
                                                                    className='mdi mdi-keyboard-space'
                                                                    style={{
                                                                       color: 'black',
                                                                       fontSize:
                                                                          '18px',
                                                                    }}
                                                                 ></span>
                                                                 {row.lineBreak ? (
                                                                    <span>
                                                                       Delete
                                                                       line
                                                                       break
                                                                    </span>
                                                                 ) : (
                                                                    <span>
                                                                       Add line
                                                                       break
                                                                    </span>
                                                                 )}
                                                              </div>
                                                           )}
                                                           <div
                                                              onClick={(e) =>
                                                                 handleAddWord(
                                                                    key,
                                                                    e,
                                                                    i
                                                                 )
                                                              }
                                                           >
                                                              <span
                                                                 className='mdi mdi-plus-circle-outline'
                                                                 style={{
                                                                    color: 'black',
                                                                    fontSize:
                                                                       '18px',
                                                                 }}
                                                              ></span>
                                                              <span>
                                                                 Add word
                                                              </span>
                                                           </div>
                                                           <div
                                                              onClick={(e) =>
                                                                 handleDeleteWord(
                                                                    key,
                                                                    e,
                                                                    i
                                                                 )
                                                              }
                                                           >
                                                              <span
                                                                 className='mdi mdi-tray-remove'
                                                                 style={{
                                                                    color: 'black',
                                                                    fontSize:
                                                                       '18px',
                                                                 }}
                                                              ></span>
                                                              <span>
                                                                 Remove word
                                                              </span>
                                                           </div>
                                                        </div>
                                                     </div>
                                                  </div>
                                               </div>
                                            </React.Fragment>
                                         ) : (
                                            <React.Fragment key={i}>
                                               {row.content.length > 0 ? (
                                                  <button
                                                     onClick={(e) => {
                                                        _handleOpenEditPosition(
                                                           key,
                                                           e
                                                        )
                                                        setSelectedItemKeyContentList(
                                                           i
                                                        )
                                                        handleStopFrom(
                                                           item.start_time
                                                        )
                                                     }}
                                                     style={{
                                                        color: 'black',
                                                        fontSize: '18px',
                                                        fontFamily:
                                                           'sans-serif',
                                                        background:
                                                           'transparent',
                                                        border: 'transparent',
                                                     }}
                                                  >
                                                     {row.content}{' '}
                                                     {row.lineBreak && (
                                                        <span
                                                           className='mdi mdi-keyboard-space'
                                                           style={{
                                                              color: 'black',
                                                              fontSize: '18px',
                                                           }}
                                                        ></span>
                                                     )}
                                                  </button>
                                               ) : (
                                                  <input
                                                     className='update-sentence'
                                                     style={{
                                                        width:
                                                           row.content.length >
                                                           0
                                                              ? `${row.content.length}rem`
                                                              : '5rem',
                                                     }}
                                                     value={row.content}
                                                     onChange={(ev) =>
                                                        updateTranscriptionItem(
                                                           key,
                                                           i,
                                                           'content',
                                                           ev
                                                        )
                                                     }
                                                     onClick={(e) =>
                                                        e.stopPropagation()
                                                     }
                                                  />
                                               )}
                                            </React.Fragment>
                                         )
                                      )
                                    : item?.contentList.map((row, i) => {
                                         return (
                                            <button
                                               key={i}
                                               onClick={(e) => {
                                                  _handleOpenEditPosition(
                                                     key,
                                                     e
                                                  )
                                                  setSelectedItemKeyContentList(
                                                     i
                                                  )
                                                  handleStopFrom(
                                                     item.start_time
                                                  )
                                               }}
                                               style={{
                                                  color: 'black',
                                                  fontSize: '18px',
                                                  fontFamily: 'sans-serif',
                                                  background: 'transparent',
                                                  textDecoration: 'underline',
                                                  textDecorationStyle: 'dotted',
                                                  textDecorationColor:
                                                     row.color,
                                                  textDecorationThickness:
                                                     '0.1em',
                                                  border: 'transparent',
                                               }}
                                            >
                                               {row.content}{' '}
                                               {row.lineBreak && (
                                                  <span
                                                     className='mdi mdi-keyboard-space'
                                                     style={{
                                                        color: 'black',
                                                        fontSize: '18px',
                                                     }}
                                                  ></span>
                                               )}
                                               {row.content.length === 0 && (
                                                  <span
                                                     style={{
                                                        padding: '4px 30px',
                                                        border: 'solid 1px',
                                                        borderColor: 'gray',
                                                        borderRadius: '4px',
                                                     }}
                                                  ></span>
                                               )}
                                            </button>
                                         )
                                      })}
                              </div>
                           </div>
                        </div>
                     </div>
                  )
               })}
         </div>
      </div>
   )
}

CaptionSection.propTypes = {
   prosesData: PropTypes.array,
   handleStopFrom: PropTypes.func,
   setProsesData: PropTypes.func,
   selectedColor: PropTypes.object,
   setDisplayedSentence: PropTypes.func,
   fontSize: PropTypes.number,
   positionY: PropTypes.number,
}

export default CaptionSection
