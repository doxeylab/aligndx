import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg';

const Background = () => {
    return (
        <>
            <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
            <img className="rightBackground" src={rightBackground} alt='rightBackground' />
        </>
    )
}

export default Background