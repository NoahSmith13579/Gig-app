import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className='spinner' role='status'>
            <span>Loading...</span>
        </div>
    );
};

export default Spinner;
