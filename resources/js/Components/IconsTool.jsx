import React from "react";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import { RiErrorWarningLine } from "react-icons/ri";



const IconsTool = ({ data, children, clicar, posicao, mensagem, icon }) => {

return (
    <>
        <div className='icon_status' style={{ marginTop: '0 !important' }}>
            <OverlayTrigger
                trigger={clicar}
                placement={posicao}
                overlay={
                    <Popover  >
                        <small  className='box_tooltips'>
                            {mensagem}
                        </small>
                    </Popover >
                }
            >
                <span>
                    {icon}
                </span>
            </OverlayTrigger>
        </div>
    </>

)

}

export default IconsTool;