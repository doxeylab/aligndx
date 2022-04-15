import { styled } from '@mui/system';
import { Button as MuiButton } from '@mui/material';


export const Btn = styled(MuiButton)`
    display: inline-block;
    width: 100%;
    position: relative;
    font-weight: bold;
    line-height: 1;
    z-index: 1;
    transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.6s;
    cursor: ${props => props.disabled ? `default` : `pointer`};

    ${props => 
        props.disabled ? 
            `border: none;
            padding: 1.0rem 1.8rem;
            background: #EEEEEE;
            `
        :
            props.fill ? 
                `border: none;
                padding: 1.0rem 1.8rem;
                background-size: 200% auto;
                background-image: linear-gradient(to right, #2f8ae1 0%, #1861a6 51%, #2f8ae1 100%);
                
                &:hover {
                    background-position: right center;
                }
                `
            :
                `padding: 0.8rem 1.6rem;
                border: double 3px transparent;
                background-image: linear-gradient(white, white), linear-gradient(to right, #2f8ae1, #1861a6);
                background-origin: border-box;
                background-clip: padding-box, border-box;
                
                &:after {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 0;
                    height: 100%;
                    left: 0;
                    bottom: 0;
                    z-index: -1;
                    z-index: -10;
                    transition: all cubic-bezier(0.19, 1, 0.22, 1) 0.3s;
                    background-image: linear-gradient(to right, #2f8ae1, #1861a6);
                }

                &:hover {
                    &:after {
                        width: 100%;
                    }
                }

                &:hover ${props.children} {
                    -webkit-text-fill-color: #fff;
                    text-decoration: none;
                }
                `
    }

    border-width: 0.2rem;
    border-radius: 0.8rem;
`