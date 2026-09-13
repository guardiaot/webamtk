import React from 'react';

export default function Origem_popup({ children, magin_top = null }) {

        return(
                <div className='origem_popup' style={{marginTop: magin_top}}>
                { children }
                </div>
        )
        
}