import React from 'react';
import { Progress } from 'semantic-ui-react';
import '../../assets/messages.css';

const ProgressBar = ({ uploadState, percentUploaded }) => {
    return (
        uploadState === 'uploading' && (
            <Progress
                className='progress__bar'
                percent={percentUploaded}
                progress
                indicating
                size='medium'
                inverted
            />
        )
    );
};

export default ProgressBar;
