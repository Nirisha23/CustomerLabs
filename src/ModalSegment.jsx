import React, { useState } from 'react'
import './App.css'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useDisclosure } from '@chakra-ui/react'
import ChevronLeft from './Assets/left-chevron.png'

function ModalSegment() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSchema, setSelectedSchema] = useState('');
    const [selectedSchemas, setSelectedSchemas] = useState([]);
    const [errorMessage, setErrorMessage] = useState(false)
    // const { onClose } = useDisclosure()

    const handleModalClick = () => {
        setIsModalOpen(true);
    }
    const handleGoBack = () => {
        setIsModalOpen(false);
    }

    const handleAddSchema = () => {
        const selectedSchemaValue = document.getElementById('mySelect').value;
        if (selectedSchemaValue) {
            setSelectedSchema(selectedSchemaValue);
            setSelectedSchemas(prevSchemas => [...prevSchemas, selectedSchemaValue]);
            document.getElementById('mySelect').selectedIndex = 0;
            setErrorMessage(false);
        } else {
            setErrorMessage(true);
        }
    };

    const sendDataToServer = async () => {
        const segmentName = document.getElementById('segmentName').value
        const data = {
            segment_name: segmentName,
            schema: selectedSchemas.map(schema => ({ [schema]: schema.replace(/_/g, ' ').replace(/\b\w/g, word => word.toUpperCase()) }))
        };
        try {
            const response = await fetch('https://webhook.site/1a294ccf-aebf-4082-85b6-553efebcd284', {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'text/plain;charset=UTF-8',
                },
                body: JSON.stringify(data)
            })
            const responseJson = await response.json();
            console.warn(responseJson);
        } catch (error) {
            console.error(error);
        }
        console.log(data)
    }

    return (
        <div className="modal-container">

            <div className="modal-header">
                <img src={ChevronLeft} alt="Go Back" />
                <h1>View Audience</h1>
            </div>
            <div className='modal-trigger-btn'>
                <button onClick={handleModalClick}>Save segment</button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} placement="right">
                <ModalOverlay />
                <ModalContent style={{ position: 'absolute', right: '0', marginBottom: '0', marginTop: '0', height: '100%' }} className='modal-content'>
                    <ModalHeader className='modal-header'><img src={ChevronLeft} alt="Go Back" className='modal-close' onClick={handleGoBack} /> Saving Segment</ModalHeader>
                    <ModalBody style={{ overflow: 'scroll' }}>
                        <div className="segment-name">
                            <label>Enter the Name of the Segment</label>
                            <input type="text" id="segmentName" placeholder='Name of the Segment' />
                        </div>
                        <div className="created-segment">
                            {selectedSchemas.map((schema, index) => (
                                <select key={index} value={schema} onChange={(event) => setSelectedSchema(event.target.value)}>
                                    <option value={schema}>{schema}</option>
                                </select>
                            ))}
                        </div>
                        <div className="add-segment-options">
                            <select id="mySelect">
                                <option value="">Select an option</option>
                                <option value="first_name" disabled={selectedSchemas.includes('first_name')}>First Name</option>
                                <option value="last_name" disabled={selectedSchemas.includes('last_name')}>Last Name</option>
                                <option value="gender" disabled={selectedSchemas.includes('gender')}>Gender</option>
                                <option value="age" disabled={selectedSchemas.includes('age')}>Age</option>
                                <option value="account_name" disabled={selectedSchemas.includes('account_name')}>Account Name</option>
                                <option value="city" disabled={selectedSchemas.includes('city')}>City</option>
                                <option value="state" disabled={selectedSchemas.includes('state')}>State</option>
                            </select>
                            <p className={errorMessage === true ? "error-msg" : "d-none"}>Please select a value</p>
                        </div>

                        <div className="new-schema-link">
                            <span>+</span><a href="#" onClick={handleAddSchema}>Add new schema</a>
                        </div>
                    </ModalBody>

                    <ModalFooter style={{ flexDirection: 'row-reverse' }}>
                        <Button className='secondary-btn'>Cancel</Button>
                        <Button mr={3} className='primary-btn' onClick={sendDataToServer}>
                            Save Segment
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div >
    )
}

export default ModalSegment
