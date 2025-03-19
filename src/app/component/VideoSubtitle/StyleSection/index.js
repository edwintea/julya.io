import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-bootstrap'
import { CompactPicker } from 'react-color'

const StyleSection = ({
   selectedColor,
   colorPicker,
   positionY,
   fontSize,
   _handleOpenColorPick,
   _handleChangeColor,
   handleChangePositionY,
   handleChangeFontSize,
   prosesData,
   setDisplayedSentence,
   setProsesData,
   findIndexPlaying,
   styleList,
   setSelectedColor,
   setFontSize,
}) => {
   const randomColor = (colors) => {
      const keys = Object.keys(colors)
      const randomIndex = Math.floor(Math.random() * keys.length)
      const indexFromKeys = keys[randomIndex]
      return { color: colors[indexFromKeys], keys: indexFromKeys }
   }

   function updateTranscriptionPositionYItem(e, value) {
      e.stopPropagation()
      let newAwsItems = [...prosesData]
      const updatedY = newAwsItems.map((row, i) => {
         return {
            ...row,
            positionY: value,
         }
      })
      handleChangePositionY(value)
      setProsesData(updatedY)
      setDisplayedSentence(updatedY[findIndexPlaying])
   }
   function updateTranscriptionFontSizeItem(e, value) {
      e.stopPropagation()
      let newAwsItems = [...prosesData]
      const updatedFontSize = newAwsItems.map((row, i) => {
         return {
            ...row,
            fontSize: value,
         }
      })
      handleChangeFontSize(value)
      setProsesData(updatedFontSize)
      setDisplayedSentence(updatedFontSize[findIndexPlaying])
   }

   function updateTranscriptionColorItem(color) {
      _handleChangeColor(color)
      const newAwsItems = [...prosesData]
      const trueKeys = Object.keys(colorPicker).filter(
         (key) => colorPicker[key] === true
      )
      const selectedColors = trueKeys.reduce((result, key) => {
         result[key] = selectedColor[key]
         return Object.values(result)[0]
      }, {})
      const selectedColorsPrimary = trueKeys.reduce((result, key) => {
         return key
      }, {})
      const BeastTextShadow = `0 0 2px ${selectedColors},0 0 3px ${selectedColors},0 0 4px ${selectedColors},0 0 5px ${selectedColors},0 0 6px ${selectedColors},0 0 7px ${selectedColors},0 0 8px ${selectedColors},0 0 9px ${selectedColors},0 0 10px ${selectedColors},0 0 11px ${selectedColors}`
      const NewBeastTextShadow = `0 0 2px ${color.hex},0 0 3px ${color.hex},0 0 4px ${color.hex},0 0 5px ${color.hex},0 0 6px ${color.hex},0 0 7px ${color.hex},0 0 8px ${color.hex},0 0 9px ${color.hex},0 0 10px ${color.hex},0 0 11px ${color.hex}`

      const MonsterTextShadow = `0 0 2px ${selectedColors},0 0 3px ${selectedColors},0 0 4px ${selectedColors}`
      const NewMonsterTextShadow = `0 0 2px ${color.hex},0 0 3px ${color.hex},0 0 4px ${color.hex}`

      const updatedStyle = newAwsItems.map((row) => {
         const updatedContentList = row.contentList.map((item) => {
            console.log(row.themeName)
            if (
               row.themeName === 'BEAST' &&
               item.textShadow === BeastTextShadow
            ) {
               return {
                  ...item,
                  textShadow: NewBeastTextShadow,
                  shadowColor:
                     selectedColorsPrimary === 'color'
                        ? item.shadowColor
                        : selectedColorsPrimary,
               }
            } else if (
               row.themeName === 'MONSTER' &&
               item.textShadow === MonsterTextShadow
            ) {
               return {
                  ...item,
                  textShadow: NewMonsterTextShadow,
                  shadowColor:
                     selectedColorsPrimary === 'color'
                        ? item.shadowColor
                        : selectedColorsPrimary,
               }
            } else
               return {
                  ...item,
                  color:
                     selectedColorsPrimary === 'color' ? color.hex : item.color,
                  shadowColor:
                     selectedColorsPrimary === 'color'
                        ? item.shadowColor
                        : selectedColorsPrimary,
               }
         })

         return {
            ...row,
            contentList: updatedContentList,
         }
      })

      setProsesData(updatedStyle)
      setDisplayedSentence(updatedStyle[findIndexPlaying])
   }

   function handleSelectedTheme(data, index, e) {
      const itemConfig = data.config
      const childItemConfig = data.configChild
      const highlightColor = data.highlight_color
      const newAwsItems = [...prosesData]

      const updatedStyle = newAwsItems.map((row, i) => {
         const randomTextShadowColor = randomColor(highlightColor)

         if (data.themeName === 'BEAST') {
            return {
               ...row,
               ...itemConfig,
               themeName: data.themeName,
               idTheme: data.id,
               contentList: row.contentList.map((item, i) => {
                  return {
                     ...item,
                     ...childItemConfig,
                     highLightColor: highlightColor,
                     shadowColor: randomTextShadowColor.keys,
                     textShadow: `0 0 2px ${randomTextShadowColor.color},0 0 3px ${randomTextShadowColor.color},0 0 4px ${randomTextShadowColor.color},0 0 5px ${randomTextShadowColor.color},0 0 6px ${randomTextShadowColor.color},0 0 7px ${randomTextShadowColor.color},0 0 8px ${randomTextShadowColor.color},0 0 9px ${randomTextShadowColor.color},0 0 10px ${randomTextShadowColor.color},0 0 11px ${randomTextShadowColor.color}`,
                  }
               }),
            }
         }
         else if (data.themeName === 'HORMOZI 2') {
            return {
               ...row,
               ...itemConfig,
               themeName: data.themeName,
               idTheme: data.id,
               contentList: row.contentList.map((item, i) => {
                  return {
                     ...item,
                     ...childItemConfig,
                     highLightColor: highlightColor,
                     fontColor: randomTextShadowColor.keys,
                     textShadow: `0 0 2px ${randomTextShadowColor.color},0 0 3px ${randomTextShadowColor.color},0 0 4px ${randomTextShadowColor.color},0 0 5px ${randomTextShadowColor.color},0 0 6px ${randomTextShadowColor.color},0 0 7px ${randomTextShadowColor.color},0 0 8px ${randomTextShadowColor.color},0 0 9px ${randomTextShadowColor.color},0 0 10px ${randomTextShadowColor.color},0 0 11px ${randomTextShadowColor.color}`,
                  }
               }),
            }
         } else {
            return {
               ...row,
               ...itemConfig,
               themeName: data.themeName,
               idTheme: data.id,
               contentList: row.contentList.map((item, i) => {
                  return {
                     ...item,
                     ...childItemConfig,
                  }
               }),
            }
         }
      })

      setSelectedColor({
         ...highlightColor,
         color: childItemConfig.color,
      })
      setFontSize(itemConfig.fontSize)
      setProsesData(updatedStyle)
      setDisplayedSentence(updatedStyle[findIndexPlaying])
   }

   return (
      <React.Fragment>
         <div
            className='row'
            style={{ marginLeft: '20px', marginBlock: '10px' }}
         >
            Themes
         </div>
         <div className='row theme-card-list' style={{ marginInline: '8px' }}>
            {styleList &&
               styleList.map((row, key) => {
                  return (
                     <div key={key} className='col-md-3'>
                        <button
                           onClick={(e) => {
                              handleSelectedTheme(row, key, e)
                           }}
                           style={{
                              ...row.config,
                              ...row.configChild,
                              fontSize: '18px',
                              paddingInline: '4px',
                           }}
                        >
                           {row.themeName}
                        </button>
                     </div>
                  )
               })}
         </div>
         <div className='card-body row' style={{ marginBottom: '-40px' }}>
            <Form.Group className='col-md-4'>
               <label>Color</label>
               <div style={{ width: '100%' }}>
                  <div className='input-group relative'>
                     <button
                        className='btn btn-lg border-primary'
                        style={{
                           backgroundColor: selectedColor.color,
                           width: '100%',
                        }}
                        onClick={() => {
                           _handleOpenColorPick('color')
                        }}
                     />
                     {colorPicker.color && (
                        <div
                           style={{
                              position: 'absolute',
                              zIndex: '2',
                           }}
                        >
                           <div
                              style={{
                                 position: 'fixed',
                                 top: '0px',
                                 right: '0px',
                                 bottom: '0px',
                                 left: '0px',
                              }}
                              onClick={() => _handleOpenColorPick('color')}
                           />
                           <CompactPicker
                              color={selectedColor.color}
                              onChangeComplete={updateTranscriptionColorItem}
                           />
                        </div>
                     )}
                     <Form.Control
                        className={'border-primary d-none'}
                        id='color'
                        type='email'
                     />
                  </div>
               </div>
            </Form.Group>
            <Form.Group className='col-md-4'>
               <label>Size</label>
               <div style={{ width: '100%' }}>
                  <div className='input-group'>
                     <Form.Control
                        className={'border-primary'}
                        type='text'
                        onChange={() => {}}
                        value={fontSize}
                     />
                     <div className='input-group-append'>
                        <div
                           className='input-group-text'
                           style={{
                              borderTopRightRadius: 12,
                              borderBottomRightRadius: 12,
                           }}
                        >
                           <span>px</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div>
                  <input
                     onChange={(e) => {
                        updateTranscriptionFontSizeItem(
                           e,
                           e.currentTarget.valueAsNumber
                        )
                     }}
                     id='default-range'
                     min={8}
                     max={50}
                     step='1'
                     type='range'
                     name='top'
                     value={fontSize}
                     style={{ width: '100%', marginTop: '10px' }}
                  />
               </div>
            </Form.Group>
            <Form.Group className='col-md-4'>
               <label>Positon Y</label>
               <div style={{ width: '100%' }}>
                  <div className='input-group'>
                     <Form.Control
                        className={'border-primary'}
                        type='text'
                        onChange={() => {}}
                        value={positionY}
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
                           e,
                           e.currentTarget.valueAsNumber
                        )
                     }}
                     id='default-range'
                     min={0}
                     max={50}
                     step='1'
                     type='range'
                     name='top'
                     value={positionY}
                     style={{ width: '100%', marginTop: '10px' }}
                  />
               </div>
            </Form.Group>
         </div>
         <p
            className='text-semi'
            style={{ marginLeft: '25px', marginBottom: '-25px' }}
         >
            Highlight colors
         </p>
         <div className='card-body row'>
            <Form.Group className='col-md-4'>
               <label>Main color</label>
               <div style={{ width: '100%' }}>
                  <div className='input-group relative'>
                     <button
                        className='btn btn-lg border-primary'
                        style={{
                           backgroundColor: selectedColor.mainColor,
                           width: '100%',
                        }}
                        onClick={() => _handleOpenColorPick('mainColor')}
                     />
                     {colorPicker.mainColor && (
                        <div
                           style={{
                              position: 'absolute',
                              zIndex: '2',
                           }}
                        >
                           <div
                              style={{
                                 position: 'fixed',
                                 top: '0px',
                                 right: '0px',
                                 bottom: '0px',
                                 left: '0px',
                              }}
                              onClick={() => _handleOpenColorPick('mainColor')}
                           />
                           <CompactPicker
                              color={selectedColor.mainColor}
                              onChangeComplete={updateTranscriptionColorItem}
                           />
                        </div>
                     )}
                  </div>
               </div>
            </Form.Group>
            <Form.Group className='col-md-4'>
               <label>Second color</label>
               <div style={{ width: '100%' }}>
                  <div className='input-group relative'>
                     <button
                        className='btn btn-lg border-primary'
                        style={{
                           backgroundColor: selectedColor.secondColor,
                           width: '100%',
                        }}
                        onClick={() => _handleOpenColorPick('secondColor')}
                     />
                     {colorPicker.secondColor && (
                        <div
                           style={{
                              position: 'absolute',
                              zIndex: '2',
                           }}
                        >
                           <div
                              style={{
                                 position: 'fixed',
                                 top: '0px',
                                 right: '0px',
                                 bottom: '0px',
                                 left: '0px',
                              }}
                              onClick={() =>
                                 _handleOpenColorPick('secondColor')
                              }
                           />
                           <CompactPicker
                              color={selectedColor.secondColor}
                              onChangeComplete={updateTranscriptionColorItem}
                           />
                        </div>
                     )}
                  </div>
               </div>
            </Form.Group>
            <Form.Group className='col-md-4'>
               <label>Third color</label>
               <div style={{ width: '100%' }}>
                  <div className='input-group relative'>
                     <button
                        className='btn btn-lg border-primary'
                        style={{
                           backgroundColor: selectedColor.thirdColor,
                           width: '100%',
                        }}
                        onClick={() => _handleOpenColorPick('thirdColor')}
                     />
                     {colorPicker.thirdColor && (
                        <div
                           style={{
                              position: 'absolute',
                              zIndex: '2',
                           }}
                        >
                           <div
                              style={{
                                 position: 'fixed',
                                 top: '0px',
                                 right: '0px',
                                 bottom: '0px',
                                 left: '0px',
                              }}
                              onClick={() => _handleOpenColorPick('thirdColor')}
                           />
                           <CompactPicker
                              color={selectedColor.thirdColor}
                              onChangeComplete={updateTranscriptionColorItem}
                           />
                        </div>
                     )}
                  </div>
               </div>
            </Form.Group>
         </div>
      </React.Fragment>
   )
}

StyleSection.propTypes = {
   selectedColor: PropTypes.object,
   colorPicker: PropTypes.object,
   positionY: PropTypes.number,
   fontSize: PropTypes.number,
   _handleOpenColorPick: PropTypes.func,
   _handleChangeColor: PropTypes.func,
   handleChangePositionY: PropTypes.func,
   handleChangeFontSize: PropTypes.func,
   prosesData: PropTypes.array,
   styleList: PropTypes.array,
   setDisplayedSentence: PropTypes.func,
   setProsesData: PropTypes.func,
   setSelectedColor: PropTypes.func,
   setFontSize: PropTypes.func,
   findIndexPlaying: PropTypes.number,
}
export default StyleSection
