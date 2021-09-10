import React from 'react';
import { 
    Container,
    TeamCardContainer, 
    TeamBG, 
    TeamFigure, 
    TeamArticle, 
    TeamArticleName, 
    TeamArticleRole 
} from './StyledTeam';

const TeamCard = ({name, role, image}) => {
    return (
        <Container>
            <TeamCardContainer>
                <TeamBG />
                <TeamFigure>
                    <img src={image} alt="team-pic" width="120px" height="120px"></img>
                </TeamFigure>
                <TeamArticle>
                    <TeamArticleName>{name}</TeamArticleName>
                    <TeamArticleRole>{role}</TeamArticleRole>
                </TeamArticle>
            </TeamCardContainer>
        </Container>
    )
}

export default TeamCard;