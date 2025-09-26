/* eslint-disable react/no-unescaped-entities */
"use client"
import { Accordion } from 'react-bootstrap'

const FaqSection = () => {
    return (
      <div className='section tekup-section-padding accordion-one'>
      <div className='container'>
          <Accordion defaultActiveKey="0" >
              <div className='tekup-accordion-column'>
                  <div className='tekup-accordion-wrap mt-0 init-wrap'>
                      <Accordion.Item eventKey="0">
                          <Accordion.Header > <span>Q1.</span> What Is The Design Process For Branding?</Accordion.Header>
                          <Accordion.Body >
                          <p> At our IT solution company, we are committed to exceptional customer service and support. If you are experiencing technical difficulties or need assistance with</p>
                          </Accordion.Body>
                      </Accordion.Item>
                  </div>
              </div>
              <div className='tekup-accordion-column'>
                  <div className='tekup-accordion-wrap mt-0 init-wrap'>
                      <Accordion.Item eventKey="2">
                          <Accordion.Header > <span>Q2.</span> How Much Does Logo Design Services Cost?</Accordion.Header>
                          <Accordion.Body >
                          <p> At our IT solution company, we are committed to exceptional customer service and support. If you are experiencing technical difficulties or need assistance with</p>
                          </Accordion.Body>
                      </Accordion.Item>
                  </div>
              </div>
              <div className='tekup-accordion-column'>
                  <div className='tekup-accordion-wrap mt-0 init-wrap'>
                      <Accordion.Item eventKey="3">
                          <Accordion.Header > <span>Q3.</span> How Long Will It Take To Complete My Project?</Accordion.Header>
                          <Accordion.Body >
                          <p> At our IT solution company, we are committed to exceptional customer service and support. If you are experiencing technical difficulties or need assistance with</p>
                          </Accordion.Body>
                      </Accordion.Item>
                  </div>
              </div>
              <div className='tekup-accordion-column'>
                  <div className='tekup-accordion-wrap mt-0 init-wrap'>
                      <Accordion.Item eventKey="4">
                          <Accordion.Header > <span>Q4.</span> What Is Included In A Round Of Revisions?</Accordion.Header>
                          <Accordion.Body >
                          <p> At our IT solution company, we are committed to exceptional customer service and support. If you are experiencing technical difficulties or need assistance with</p>
                          </Accordion.Body>
                      </Accordion.Item>
                  </div>
              </div>
              <div className='tekup-accordion-column'>
                  <div className='tekup-accordion-wrap mt-0 init-wrap'>
                      <Accordion.Item eventKey="5">
                          <Accordion.Header > <span>Q5.</span> Are we too small for managed IT services?</Accordion.Header>
                          <Accordion.Body >
                          <p> At our IT solution company, we are committed to exceptional customer service and support. If you are experiencing technical difficulties or need assistance with</p>
                          </Accordion.Body>
                      </Accordion.Item>
                  </div>
              </div>
              <div className='tekup-accordion-column'>
                  <div className='tekup-accordion-wrap mt-0 init-wrap'>
                      <Accordion.Item eventKey="6">
                          <Accordion.Header > <span>Q6.</span> What Is Included In A Round Of Revisions?</Accordion.Header>
                          <Accordion.Body >
                          <p> At our IT solution company, we are committed to exceptional customer service and support. If you are experiencing technical difficulties or need assistance with</p>
                          </Accordion.Body>
                      </Accordion.Item>
                  </div>
              </div>
          </Accordion>
      </div>
  </div >
    );
};

export default FaqSection;