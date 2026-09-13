
import React from 'react';

export default function Origem_popup_rodape({ children, height = null , padding = null }) {

        //style={{height: '45px !important', padding: '8px !important'}}
      
        return(
                <div className='origem_popup_rodape' style={{height: '45px !important', padding: '8px !important'}} >
                { children }
                </div>
        )
        
}