import React from 'react';
import './render-data.css'

const RenderData = ({data}) => {
    return (
        <div
            className='render-data'
        >
            <pre>
            {
                JSON.stringify(data, null, 3)
            }
        </pre>
        </div>
    );
};

export default RenderData;
