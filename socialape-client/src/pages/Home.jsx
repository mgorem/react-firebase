import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import axios from 'axios'

// Components
import Scream from '../components/Scream'

const Home = () => {
  const [screams, setScreams] = useState(null)

  useEffect(() => {
    axios.get('/screams')
    .then(res => {
      console.log(res.data)
      setScreams({
        screams: res.data
      })
    })
    .catch(err => console.log(err))
  }, [])
  
  let recentScreamsMarkUp = screams ? 
    screams.map((scream) => <Scream scream={scream} />)
   : <p style={{fontWeight: 600}}>Ceep Kalm Screams Loading...</p>
   
  return (
    <Grid container spacing={16}>
      <Grid item sm={8} xs={12}>
        <p>{recentScreamsMarkUp}</p>
      </Grid>
      <Grid item sm={4} xs={12}>
        <p>Profile...</p>
      </Grid>
    </Grid>
  )
}

export default Home
