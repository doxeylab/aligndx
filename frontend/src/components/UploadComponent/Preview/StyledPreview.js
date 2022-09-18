import styled from 'styled-components';

export const PreviewContainer = styled.div`
    max-height: 200px;
    min-height: 200px;
    overflow-y: auto;
    border: 3px solid #4aa1f3;
`
export const PreviewItem = styled.div`
    width: 100%;
    vertical-align: middle;
    position: relative;
    line-height: 50px;
    height: 70px;
    padding: 10px;
    text-align: left;
    > div {
        overflow: hidden;
    }
`

export const PreviewFileType = styled.div`
    display: inline-block !important;
    position: absolute;
    left: 10px;
    top: 35px;
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
    padding: 0 4px;
    border-radius: 2px;
    box-shadow: 1px 1px 2px #abc;
    color: #fff;
    background: #4aa1f3;
    text-transform: uppercase;
`

export const PreviewFileName = styled.div`
    font-size: 1rem;
    display: inline-block;
    vertical-align: top;
    margin-left: 15px;
    color: #4aa1f3;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
`

export const PreviewFileSize = styled.div`
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    margin-right: 5px;
    color: $dark-grey;
    font-weight: 700;
    font-size: 14px;
`

export const PreviewFileRemove = styled.div`
    display: inline-block;
    float: right;
    cursor: pointer;
`