import './App.css';
import {React, useState, useEffect} from 'react';
import Input from './components/Input';
import Header from './components/Header';
import Results from './components/Results';


const credentials = btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`);

const getToken = async () => {
  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
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
  }, [tokenFailed]);

  
  return (
    <div className="App">
      <Header />
      <Input token={token} setCalculatedResults={setCalculatedResults} setCalculationComplete={setCalculationComplete}/>
      {calculationComplete ? <Results calculatedResults={calculatedResults}/> : null}
    </div>
  );
}

export default App;
