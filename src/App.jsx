import { useEffect, useRef, useState } from 'react'
import { authenticate, getUserMe } from './utils/genesysCloudUtils.js'
import './App.css'
import GenesysHSM from './components/button/GenesysHSM.jsx'
import { CircularProgress, Box, Skeleton } from '@mui/material';
function App() {
    const [initialized, setInitialized] = useState(false)
    const [error, setError] = useState(null)
    const [name, setName] = useState('');
    const authCalled = useRef(false)

    async function getPlatformClientData() {
        try {
            const data = await authenticate()
            // console.log('AUTH:', data)
            const userDetailsResponse = await getUserMe()
            setName(userDetailsResponse.name)
            // console.log('UserMe:', userDetailsResponse)

            setInitialized(true)
        } catch (err) {
            console.error('Erro na autenticação:', err)
            setError(err)
        }
    }

    useEffect(() => {
        if (authCalled.current) {
            return
        }

        authCalled.current = true

        //apagar e descomentar abaixo
        //setInitialized(true)
        getPlatformClientData()
    }, [])

    if (error) {
        return (
            <Box>
                <h1>Erro na autenticação</h1>
                <pre>
                    {JSON.stringify(error, null, 2)}
                </pre>
            </Box>
        )
    }

    if (!initialized) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '40px'
                }}
            >
                <CircularProgress
                    size={300}
                    aria-label="Loading…"
                />
                {/* <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                <Skeleton variant="rectangular" width='100%' height={60} />
                <Skeleton variant="rounded" width='100%' height={60} /> */}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 3,
                width: '100%',
                height: '100%',
                // height: '100vh',
                // backgroundColor: '#050505',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <GenesysHSM
                name={name}
            />
        </Box>
    )
}

export default App