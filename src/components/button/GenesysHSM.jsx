import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Stack,
    Alert,
    CircularProgress,
    MenuItem
} from '@mui/material'
//import { carregarTemplatesGenesys } from '../../utils/genesysTemplates.js';
import Preview from '../preview/Preview.jsx';
import Parameters from '../parameters/Parameters.jsx';
import IntegrationChoice from '../integration_choice/IntegrationChoice.jsx';
import { useEffect, useState } from 'react'
import { getMessageTemplates, postDataAction } from '../../utils/genesysCloudUtils.js';


function GenesysHSM(props) {

    //console.log(props.name)
    const [templates, setTemplates] = useState([])
    const [template, setTemplate] = useState(null)
    const [integration, setIntegration] = useState(null)
    const [numeroDestino, setNumeroDestino] = useState('')
    const [carregandoTemplates, setCarregandoTemplates] = useState(true)
    const [parameters, setParameters] = useState({})
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState(null)



    useEffect(() => {
        getMessageTemplates()
            .then(resposta => {
                // console.log(resposta)
                setTemplates(resposta)
            })
            .catch(erro => {
                setErro(erro)
            })
            .finally(() => {
                setCarregandoTemplates(false)
            })

    }, [])
    // function getSelectedTemplate() {
    //     return templates.find(
    //         template => template.id === templateId
    //     )
    // }

    function parametrosPreenchidos() {


        if (!template.substitutions) {
            return true
        }

        if (Object.keys(parameters).length != template.substitutions.length) {
            return false
        }

        return Object.keys(parameters).every(param => Boolean(parameters[param]))
    }

    async function handleEnviar() {
        if (!template || !numeroDestino) {
            setErro('Selecione um template e informe o número de destino.')
            return
        }

        try {
            setEnviando(true)
            setErro(null)
            const bodyParameters = []
            Object.keys(parameters).forEach((value) => {
                const key = value.replace("BODY", "").replace("HEADER", "").replace("FOOTER", "")

                bodyParameters.push({ id: key, value: parameters[value].value })


            })
            // console.log(bodyParameters)
            let body = {
                fromAddress: integration.id,
                toAddress: numeroDestino,
                useExistingActiveConversation: true,
                toAddressMessengerType: "whatsapp",
                messagingTemplate: {
                    responseId: template.id,
                    bodyParameters: bodyParameters
                }
            }


            console.log({
                template,
                numeroDestino,
            })

            await postDataAction(body)

        } catch (err) {
            console.error(err)
            setErro('Não foi possível enviar o template.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Box
            sx={{
                p: 3,
                width: '90%',
                height: '100%',
                backgroundColor: '#ffffff',
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 2.5,
                    fontWeight: 600,
                    color: '#222',
                }}
                align="left"
            >
                Bem-vindo, {props.name}!
            </Typography>

            <Card
                elevation={1}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#e5e5e5',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2.5,
                            fontWeight: 600,
                            color: '#222',
                        }}
                    >
                        Enviar Template
                    </Typography>

                    <Stack spacing={2.5}>

                        {/* Template */}
                        <TextField
                            select
                            label="Selecione o template"
                            value={template?.id ?? ''}
                            onChange={(e) => {
                                const selected = templates.find(
                                    template => template.id === e.target.value
                                )

                                setTemplate(selected)
                            }}
                            fullWidth
                            size="small"
                            disabled={carregandoTemplates}
                        >
                            {templates.map((template) => (
                                <MenuItem
                                    key={template.id}
                                    value={template.id}
                                >
                                    {template.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <IntegrationChoice
                            integration={integration}
                            setIntegration={setIntegration}
                            setErro={setErro}
                        />
                        {/* Número de destino */}
                        <TextField
                            label="Número de destino"
                            placeholder="5511999999999"
                            value={numeroDestino}
                            onChange={(e) => setNumeroDestino(e.target.value)}
                            fullWidth
                            size="small"
                        />

                        {template && (
                            <>
                                {/* Parâmetros */}

                                <Parameters
                                    template={template}
                                    parameters={parameters}
                                    setParameters={setParameters}
                                />
                                <Preview
                                    template={template}
                                    parameters={parameters}
                                />
                            </>
                        )}

                        {/* Enviar */}
                        <Button
                            variant="contained"
                            onClick={handleEnviar}
                            disabled={
                                enviando ||
                                !template ||
                                !numeroDestino
                                || !parametrosPreenchidos()
                            }
                            startIcon={
                                enviando
                                    ? <CircularProgress size={16} />
                                    : null
                            }
                            sx={{
                                mt: 0.5,
                                py: 1,
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            {enviando ? 'Enviando...' : 'Enviar'}
                        </Button>

                        {erro && (
                            <Alert severity="error">
                                {erro}
                            </Alert>
                        )}

                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )

}

export default GenesysHSM