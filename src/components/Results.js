import React from 'react'

function Results(props) {

    let firstArtistName = props.calculatedResults["firstArtist"]["map"]["name"];
    let firstArtistImage = props.calculatedResults["firstArtist"]["map"]["images"][1]["url"];
    let firstArtistGenres = props.calculatedResults["firstArtist"]["genres"];

    let secondArtistname = props.calculatedResults["secondArtist"]["map"]["name"];
    let secondArtistImage = props.calculatedResults["secondArtist"]["map"]["images"][1]["url"];
    let secondArtistGenres = props.calculatedResults["secondArtist"]["genres"];

    let sharedGenres = props.calculatedResults["shared"]["genres"];


    return (
        <div className='results-div'>
            <div className='percentage-div'>
                <h1><u>Your result is</u></h1>
                <h2>{props.calculatedResults["finalValue"] + '%'}</h2>
            </div>
            
            <hr />

            <div className='artists-div'>
                <h2><u>You searched for</u></h2>
                <div>
                    <img src={firstArtistImage} alt="Artist 1"></img>
                    <h3>{firstArtistName}</h3>
                </div>
                <div>
                    <img src={secondArtistImage} alt="Artist 2"></img>
                    <h3>{secondArtistname}</h3>
                </div>
            </div>

            <hr />

            <div className='calculated-div'>
                <div className="genre-div">
                    <h3><u>{firstArtistName}'s genres</u></h3>
                    <ul>{Array.from(firstArtistGenres).map((element) => (
                        <li>{element.charAt(0).toUpperCase() + element.slice(1)}</li>
                    ))}</ul>
                    <h3><u>{secondArtistname}'s genres</u></h3>
                    <ul>{Array.from(secondArtistGenres).map((element) => (
                        <li>{element.charAt(0).toUpperCase() + element.slice(1)}</li>
                    ))}</ul>
                    <h3><u>Similar genres</u></h3>
                    <ul>{Array.from(sharedGenres).map((element) => (
                        <li>{element.charAt(0).toUpperCase() + element.slice(1)}</li>
                    ))}</ul>
                </div>
            </div>
        </div>
    )
}

export default Results;