import {
    Box,
    Typography,
    MenuItem,
    TextField

} from '@mui/material'
import { useEffect, useState } from 'react'
import { getMessageIntegrations } from '../../utils/genesysCloudUtils.js'

export default function IntegrationChoice({ setErro, integration, setIntegration }) {

    const [integrations, setIntegrations] = useState([])
    const [carregando, setCarregando] = useState(true)
    // const [erro, setErro] = useState(null)
    useEffect(() => {
        getMessageIntegrations()
            .then(resposta => {
                console.log(resposta)
                setIntegrations(resposta)
            })
            .catch(erro => {
                setErro(erro)
            })
            .finally(() => {
                setCarregando(false)
            })

    }, [])


    return (
        <TextField
            select
            label="Selecione a integração"
            value={integration?.id ?? ''}
            onChange={(e) => {
                const selected = integrations.find(
                    integration => integration.id === e.target.value
                )

                setIntegration(selected)
            }}
            fullWidth
            size="small"
            disabled={carregando}
        >
            {integrations.map((integration) => (
                <MenuItem
                    key={integration.id}
                    value={integration.id}
                >
                    {integration.name}
                </MenuItem>
            ))}
        </TextField>
    )




}