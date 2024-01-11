import './App.css';
import {React, useState, useEffect} from 'react';
import Input from './components/Input';
import Header from './components/Header';
import Results from './components/Results';

const client_id = '6bfdf28758ca479a8afa8a503feab7d2';
const client_secret = '9141120dbcec4e669dc4ad7f5e06718e';
const credentials = btoa(`${client_id}:${client_secret}`);

const getToken = async () => {
  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    const token = data.access_token;
    return token;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

function App() {
  const [token, setToken] = useState('');
  const [tokenFailed, setTokenFailed] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState({});
  const [calculationComplete, setCalculationComplete] = useState(false);

  const genNewToken = async () => {
    const newToken = await getToken();
    if (!newToken) {
      setTokenFailed(true);
    } else {
      setToken(newToken);
    }
  };

  useEffect(() => {
    genNewToken();
  }, []);

  
  return (
    <div className="App">
      <Header />
      <Input token={token} setCalculatedResults={setCalculatedResults} setCalculationComplete={setCalculationComplete}/>
      {/* {calculatedResults ? <p>{console.log("calculatedResults", calculatedResults)}</p> : null} */}
      {calculationComplete ? <Results calculatedResults={calculatedResults}/> : null}
    </div>
  );
}

export default App;
