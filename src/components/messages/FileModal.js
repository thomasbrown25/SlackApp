import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

const FileModal = ({ modal, closeModal, uploadFile }) => {
    const [_file, setFile] = useState(null);

    const [_authorized, setAuthorized] = useState(['image/jpeg', 'image/png']);

    const addFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    const sendFile = () => {
        if (_file) {
            if (isAuthorized(_file.name)) {
                const metadata = { contentType: mime.lookup(_file.name) };
                uploadFile(_file, metadata);
                closeModal();
                setFile(null);
            }
        }
    };

    const isAuthorized = (filename) =>
        _authorized.includes(mime.lookup(filename));

    return (
        <Modal basic open={modal} onClose={closeModal}>
            <Modal.Header>Select an Image File</Modal.Header>
            <Modal.Content>
                <Input
                    onChange={addFile}
                    fluid
                    label='File types: jpg, png'
                    name='file'
                    type='file'
                />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={sendFile} color='green' inverted>
                    <Icon name='checkmark' /> Send
                </Button>
                <Button color='red' inverted onClick={closeModal}>
                    <Icon name='remove' /> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default FileModal;
