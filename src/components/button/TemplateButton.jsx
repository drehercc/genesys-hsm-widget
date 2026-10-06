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
    MenuItem,
    TextareaAutosize
} from '@mui/material'
import { carregarTemplates } from '../../utils/metaUtils';


import { useEffect, useState } from 'react'

function TemplateButton(props) {

    console.log(props.name)
    const [templates, setTemplates] = useState([])
    const [templateId, setTemplateId] = useState('')
    const [numeroDestino, setNumeroDestino] = useState('')
    const [carregandoTemplates, setCarregandoTemplates] = useState(true)
    const [parameters, setParameters] = useState({})
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState(null)


    useEffect(() => {
        carregarTemplates()
            .then(resposta => {
                setTemplates(resposta)
            })
            .catch(erro => {
                setErro(erro)
            })
            .finally(() => {
                setCarregandoTemplates(false)
            })

    }, [])
    function getSelectedTemplate() {
        return templates.find(
            template => template.id === templateId
        )
    }
    function getPreview() {
        const template = getSelectedTemplate()

        if (!template) {
            return ''
        }

        return template.components
            .filter(component =>
                ['HEADER', 'BODY', 'FOOTER'].includes(component.type)
            )
            .map(component => {
                if (!component.text) {
                    return ''
                }

                const text = component.text.replace(
                    /\{\{(\d+)\}\}/g,
                    (_, number) => {
                        return parameters[number + component.type]?.value || `{{${number}}}`
                    }
                )

                return text
            })
            .filter(Boolean)
            .join('\n\n')
    }
    function getExamples() {
        const templateParams = []
        const template = getSelectedTemplate()
        template.components.forEach((component) => {
            if (component.text) {
                const parameters = component.text.match(/\{\{\d+\}\}/g) ?? []
                if (parameters.length > 0) {
                    templateParams.push({ ...component, fields: parameters })
                }
            }

            console.log('parameers:' + parameters)
        })

        console.log(templateParams)
        return templateParams
    }


    async function handleEnviar() {
        if (!templateId || !numeroDestino) {
            setErro('Selecione um template e informe o número de destino.')
            return
        }

        try {
            setEnviando(true)
            setErro(null)

            console.log({
                templateId,
                numeroDestino,
            })

            // futuramente:
            // await api.post('/mensagens/template', {
            //   templateId,
            //   numeroDestino,
            // })

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
                            value={templateId}
                            onChange={(e) => setTemplateId(e.target.value)}
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

                        {/* Número de destino */}
                        <TextField
                            label="Número de destino"
                            placeholder="5511999999999"
                            value={numeroDestino}
                            onChange={(e) => setNumeroDestino(e.target.value)}
                            fullWidth
                            size="small"
                        />

                        {templateId.length > 0 && (
                            <>
                                {/* Parâmetros */}
                                <Box
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: '#e5e5e5',
                                        borderRadius: 2,
                                        backgroundColor: '#fafafa',
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            mb: 1.5,
                                            fontWeight: 600,
                                            color: '#333',
                                        }}
                                    >
                                        Preencha os parâmetros
                                    </Typography>

                                    <Stack spacing={1.5}>
                                        {getExamples().map((example) => (
                                            <Box key={example.type}>
                                                <Typography>
                                                    {example.type}
                                                </Typography>
                                                {example.fields.map((field) => {
                                                    const parameterNumber = Number(
                                                        field
                                                            .replace('{{', '')
                                                            .replace('}}', '')
                                                    )

                                                    return (
                                                        <TextField
                                                            sx={{
                                                                width: '100%',
                                                                mb: 1,
                                                                '& .MuiOutlinedInput-input': {
                                                                    padding: '10px 14px',
                                                                },
                                                            }}
                                                            key={`${example.type}_${field}`}
                                                            variant="outlined"
                                                            label={`Parâmetro ${parameterNumber}`}
                                                            value={
                                                                parameters[
                                                                    parameterNumber + example.type
                                                                ]?.value ?? ''
                                                            }
                                                            onChange={(e) => {
                                                                const value = e.target.value

                                                                setParameters(prev => ({
                                                                    ...prev,
                                                                    [parameterNumber + example.type]: {
                                                                        value,
                                                                        type: 'text'
                                                                    }
                                                                }))
                                                            }}
                                                            size="small"
                                                        />
                                                    )
                                                })}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Preview */}
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 600,
                                            color: '#333',
                                        }}
                                    >
                                        Pré-visualização
                                    </Typography>

                                    <TextareaAutosize
                                        value={getPreview()}
                                        readOnly
                                        minRows={8}
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            resize: 'none',
                                            padding: '14px',
                                            fontFamily: 'inherit',
                                            fontSize: '14px',
                                            lineHeight: 1.5,
                                            color: '#222',
                                            backgroundColor: '#f7f7f7',
                                            border: '1px solid #dddddd',
                                            borderRadius: '8px',
                                            outline: 'none',
                                        }}
                                    />
                                </Box>
                            </>
                        )}

                        {/* Enviar */}
                        <Button
                            variant="contained"
                            onClick={handleEnviar}
                            disabled={
                                enviando ||
                                !templateId ||
                                !numeroDestino
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

export default TemplateButton