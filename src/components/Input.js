import {React, useState, useEffect} from 'react';
import {TailSpin} from 'react-loader-spinner'


//TODO: Make the calculation based on genres, artists/related artists, playlists




function Input(props) {
    const [firstArtist, setFirstArtist] = useState('');
    const [secondArtist, setsecondArtist] = useState('');
    const [invalidInputs, setInvalidInputs] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pleaseWait, setPleaseWait] = useState(false);

    const requestOptions = {
        method: "GET",
        headers: {
        //   "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      }

    const calculateSimilarity = async (firstArtistMap, firstArtistPlaylists, secondArtistMap, secondArtistPlaylists) => {
        // console.log("Starting");
        // const startTime = (new Date()).getTime();

        let currCalculatedResults = {};
        currCalculatedResults["firstArtist"] = {};
        currCalculatedResults["firstArtist"]["map"] = firstArtistMap;
        currCalculatedResults["secondArtist"] = {};
        currCalculatedResults["secondArtist"]["map"] = secondArtistMap;
        currCalculatedResults["shared"] = {};

        //---- Calculate genre score -------------------------------------------
        let genreScore = 0;
        
        const firstArtistGenres = new Set(firstArtistMap.genres);
        const secondArtistGenres = new Set(secondArtistMap.genres);
        let sharedGenres = new Set();

        let weightingGenreScore = firstArtistGenres.size + secondArtistGenres.size;

        firstArtistGenres.forEach((genre) => {
            if (secondArtistGenres.has(genre)) {
                genreScore++;
                sharedGenres.add(genre);
            } 
            // else {
            //     secondArtistGenres.forEach((secondGenre) => {
            //         if (secondGenre.includes(genre)) {
            //             genreScore++;
            //             sharedGenres.add(genre);
            //             console.log('INCLUDES');
            //             // weightingGenreScore += 0.5;
            //         }
            //     });
            // }
        });

        secondArtistGenres.forEach((genre) => {
            if (firstArtistGenres.has(genre)) {
                genreScore++;
                sharedGenres.add(genre);
            }
        });

        
        
        //Adding to results object
        currCalculatedResults["firstArtist"]["genres"] = firstArtistGenres;
        currCalculatedResults["secondArtist"]["genres"] = secondArtistGenres;
        currCalculatedResults["shared"]["genres"] = sharedGenres;
       

        // Weighting
        genreScore = genreScore / weightingGenreScore;

        //---- Calculate similar artists score ---------------------------------
        let similarArtistsScore = 0;

        const firstArtistSimilarResponse = await fetch("https://api.spotify.com/v1/artists/"+ firstArtistMap.id + "/related-artists", requestOptions);
        const firstArtistSimilarJson = await firstArtistSimilarResponse.json();
        const firstArtistSimilarArtists = new Set(firstArtistSimilarJson.artists);

        const secondArtistSimilarResponse = await fetch("https://api.spotify.com/v1/artists/"+ secondArtistMap.id + "/related-artists", requestOptions);
        const secondArtistSimilarJson = await secondArtistSimilarResponse.json();
        const secondArtistSimilarArtists = new Set(secondArtistSimilarJson.artists);

        let newFirstSimilarArtists = new Set();
        for (const artistObject of firstArtistSimilarArtists) {
            newFirstSimilarArtists.add(artistObject.id);
        }

        let newSecondSimilarArtists = new Set();
        for (const artistObject of secondArtistSimilarArtists) {
            newSecondSimilarArtists.add(artistObject.id);
        }

        let sharedSimilarArtists = new Set(); //For storing shared similar artists

        // console.log(newFirstSimilarArtists);
        // console.log(newSecondSimilarArtists);

        newFirstSimilarArtists.forEach((artist) => {
            
            if (artist === secondArtistMap.id || newSecondSimilarArtists.has(artist)) {
                similarArtistsScore++;
                sharedSimilarArtists.add(artist);
            }
        });

        newSecondSimilarArtists.forEach((artist) => {
            
            if (artist === firstArtistMap.id || newFirstSimilarArtists.has(artist)) {
                similarArtistsScore++;
                sharedSimilarArtists.add(artist);
            }
        });

        //Adding to results object
        currCalculatedResults["firstArtist"]["similarArtists"] = newFirstSimilarArtists;
        currCalculatedResults["secondArtist"]["similarArtists"] = newSecondSimilarArtists;
        currCalculatedResults["shared"]["similarArtists"] = secondArtistGenres;

        // Weighting
        similarArtistsScore = similarArtistsScore / (firstArtistSimilarArtists.size + secondArtistSimilarArtists.size);

        //---- Calculate playlists score ---------------------------------------
        // let playlistScore = 0;
        // let numberToDivide = 0;

        // const firstArtistPlaylistsSet = new Set(firstArtistPlaylists);
        // const secondArtistPlaylistsSet = new Set(secondArtistPlaylists);
        // let sharedPlaylists = new Set();

        // for (const playlist of firstArtistPlaylistsSet) {
        //     let artistTrackResponse = await fetch(playlist.tracks.href, requestOptions);
        //     let artistTrackJson = await artistTrackResponse.json();
        //     let artistTracks = artistTrackJson.items;
        //     for (const track of artistTracks) {
        //         if (track.track && track.track.artists) {
        //             numberToDivide++;
        //             for (const artist of track.track.artists) {
        //                 if (artist.id === secondArtistMap.id) {
        //                     playlistScore++;
        //                     sharedPlaylists.add(playlist);
        //                     break;
        //                 };
        //             };
        //             break;
        //         };
               
        //     };            
        // };

        // for (const playlist of secondArtistPlaylistsSet) {
        //     let artistTrackResponse = await fetch(playlist.tracks.href, requestOptions);
        //     let artistTrackJson = await artistTrackResponse.json();
        //     let artistTracks = artistTrackJson.items;
        //     for (const track of artistTracks) {
        //         if (track.track && track.track.artists) {
        //             numberToDivide++;
        //             for (const artist of track.track.artists) {
        //                 if (artist.id === firstArtistMap.id) {
        //                     playlistScore++;
        //                     sharedPlaylists.add(playlist);
        //                     break;
        //                 };
        //             };
        //             break;
        //         };
        //     };            
        // };

        // // console.log("playlist score pre-weight: ", playlistScore);
        // // if (secondArtistPlaylistsSet === firstArtistPlaylistsSet) {
        // //     console.log("Yeah, they equal");
        // // } else {
        // //     console.log("They are not equal fuck");
        // // }

        // //Adding to results object
        // currCalculatedResults["firstArtist"]["playlistSet"] = firstArtistPlaylistsSet;
        // currCalculatedResults["secondArtist"]["playlistSet"] = secondArtistPlaylistsSet;
        // currCalculatedResults["shared"]["playlistSet"] = sharedPlaylists;
        
        // //Weighting
        // playlistScore = playlistScore / numberToDivide;

        // console.log(firstArtistPlaylistsSet);
        // console.log(secondArtistPlaylistsSet);

        

        //---- Calculate final percentage --------------------------------------
        // const finalValue = Math.round(((0.6 * genreScore) + (0.2 * similarArtistsScore) + (0.2 * playlistScore)) * 100);
        const finalValue = Math.round(((0.6 * genreScore) + (0.4 * similarArtistsScore)) * 100);

        
        setLoading(false);
        setPleaseWait(false);

        //Add percentage + set calculated results prop
        currCalculatedResults["finalValue"] = finalValue;
        props.setCalculatedResults(currCalculatedResults);
        props.setCalculationComplete(true);
        console.log(currCalculatedResults);

        console.log("Genre Score: ", genreScore);
        console.log("Similar Artist Score: ", similarArtistsScore);
        // console.log("Playlists Score: ", playlistScore);
        // console.log("Final Value: ", finalValue);
        // console.log("FINISHED!");
        // const endTime = (new Date()).getTime();
        // console.log("Operation took this many seconds:", (endTime - startTime)/1000);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) { //If currently loading when button is clicked, shows please wait message
            setPleaseWait(true);
        }
        else if (firstArtist === '' || secondArtist === '') { //If either field is not filled in, do nothing
            //Shows invalid inputs message
            setInvalidInputs(true);
        } else {
            //Hides invalid inputs message
            setInvalidInputs(false);

            //Shows loading spinner
            props.setCalculationComplete(false);
            setLoading(true);

            //Information for first artist
            const firstArtistResponse = await fetch(("https://api.spotify.com/v1/search?q=" + 
                firstArtist.replaceAll(" ", "+") + 
                "&type=artist%2Cplaylist&locale=en-US%2Cen%3Bq%3D0.5&offset=0&limit=20"), requestOptions);

            const firstArtistSearchResults = await firstArtistResponse.json();
            // console.log(firstArtistSearchResults);
            
            const firstArtistMap = firstArtistSearchResults.artists.items[0];
            const firstArtistPlaylists = firstArtistSearchResults.playlists.items;
            // const firstArtistGenres = new Set(firstArtistMap.genres);

            //Information for second artist
            const secondArtistResponse = await fetch(("https://api.spotify.com/v1/search?q=" + 
                secondArtist.replaceAll(" ", "+") + 
                "&type=artist%2Cplaylist&locale=en-US%2Cen%3Bq%3D0.5&offset=0&limit=20"), requestOptions);

            const secondArtistSearchResults = await secondArtistResponse.json();
            
            const secondArtistMap = secondArtistSearchResults.artists.items[0];
            const secondArtistPlaylists = secondArtistSearchResults.playlists.items;
            // const secondArtistGenres = new Set(secondArtistMap.genres);

            
            calculateSimilarity(firstArtistMap, firstArtistPlaylists, secondArtistMap, secondArtistPlaylists);
            
                        
        }

    };

    return (
        <div className='input-div'>

            <form className='input-form' onSubmit={handleSubmit}>
                <input type='text' placeholder='Type First Artist Name Here' onChange={e => setFirstArtist(e.target.value)}></input>
                <input type='text' placeholder='Type Second Artist Name Here' onChange={e => setsecondArtist(e.target.value)}></input>
                <input type='submit' value='Submit'/>
            </form>

            <div className='input-other-parts'>
                {invalidInputs ? <p className='invalid-text'>Please input something for both artists</p> : null}
                {pleaseWait ? <p className='invalid-text'>Please wait for the previous operation to finish</p>: null}
                {loading ? <TailSpin color="#22b758" ariaLabel='Spinner' className='spinner'/> : null}
            </div>
            
        </div>
    )
};

export default Input;