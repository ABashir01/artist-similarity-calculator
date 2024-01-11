import {React} from 'react';

function Header() {
    return (
        <div className="header-div">
            <div className='title-div'><b>Artist Similarity Calculator</b> by Ahad Bashir</div>
            <div className='links-div'>
                <a href='https://ahad-bashir-portfolio.netlify.app/' target='_blank' rel="noopener noreferrer">Portfolio</a>
                <a href='https://github.com/ABashir01/artist-similarity-calculator' target='_blank' rel="noopener noreferrer">Github</a>
            </div>
        </div>
    );
}

export default Header;