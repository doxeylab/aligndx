import styled from 'styled-components';

export const Container = styled.div`
    background-color: white;
    width: 280px !important;
    height: 300px;
    border-radius: 10px;
    box-shadow: inset 0px 0px 0px 1px #edeef4;
    position: relative;
    transition: all 0.4s ease;
`

export const TeamCardContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
`

export const TeamBG = styled.span`
    position: absolute;
    width: 100%;
    height: 100px;
    top: 0;
    border-radius: 10px 10px 0px 0px;
    transition: all 0.4s ease;
    background: linear-gradient(140deg, #2f8ae1 0%, #1861a6);
    z-index: 1;
`

export const TeamFigure = styled.figure`
    width: 120px;
    height: 120px;
    border-radius: 100%;
    overflow: hidden;
    z-index: 1;
    position: absolute;
    top: 40px;
    border: 3px solid #FFFFFF;
    transition: all 0.4s ease;
    box-shadow: 0px 4px 10px rgb(111 112 115 / 30%);
`

export const TeamArticle = styled.article`
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    transform: translateY(70px);
    transition: all 0.3s ease;
`

export const TeamArticleName = styled.p`
    font-size: 20px;
    color: #6F7073;
    font-weight: 300;
`

export const TeamArticleRole = styled.p`
    font-size: 14px;
    font-weight: 600;
    color: #CBCBCB;
    letter-spacing: 0.8px;
    margin-top: 5px;
`