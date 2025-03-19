import React from 'react'
import { Form } from 'react-bootstrap'

export default function PublishTab() {
   return (
      <div
         className='card-body'
         style={{
            marginLeft: '1px',
            overflow: 'scroll',
            height: '550px',
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
               Julya.io
            </p>
            <p
               style={{
                  fontSize: '18px',
                  margin: '0px',
                  fontFamily: 'sans-serif',
               }}
            >
               Auto-generate description & hashtag by Julya AI
            </p>
         </div>
         <Form>
            <Form.Group
               className='mb-3'
               controlId='exampleForm.ControlTextarea1'
            >
               <Form.Label>Description & Hashtag</Form.Label>
               <Form.Control as='textarea' rows={10} />
            </Form.Group>
         </Form>
         <div
            className='button-action-desc-publish'
            style={{
               display: 'flex',
               justifyContent: 'start',
               alignItems: 'center',
            }}
         >
            <button>Copy</button>
            <button>Regenerate</button>
            <button>Short desc</button>
            <button>Long desc</button>
         </div>
      </div>
   )
}
