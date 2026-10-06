import {
    Box,
    Button,
    Typography,
    TextareaAutosize
} from '@mui/material'

export default function Preview({ template, parameters }) {


    function getButtons() {

        if (!template) {
            return []
        }

        const whatsApp = template.messagingTemplate.whatsApp

        return whatsApp.buttons ?? []
    }


    function getPreview() {
        // const template = getSelectedTemplate()
        let textoFinal = ''
        let textoHeader = ''
        let textoBody = ''
        let textoFooter = ''
        if (!template) {
            return textoFinal
        }
        const regex = /{{\w*}}/g;
        const whatsApp = template.messagingTemplate.whatsApp

        if (whatsApp.header && whatsApp.header.type == "Text") {
            textoHeader = whatsApp.header.content;
            const headerParams = whatsApp.header.content.match(regex) ?? [];
            if (headerParams.length > 0) {

                for (let i = 0; i < headerParams.length; i++) {
                    let numero = headerParams[i].replace('{{', '').replace('}}', '')

                    if (parameters[numero + 'HEADER']?.value) {
                        textoHeader = textoHeader.replace(headerParams[i], parameters[numero + 'HEADER'].value)
                    }
                    else {
                        textoHeader = textoHeader.replace(headerParams[i], `{{${numero}}}`)
                    }

                }
            }
        }


        for (let i = 0; i < template.texts.length; i++) {
            textoBody = textoBody.concat(template.texts[i].content)
            const bodyParams = template.texts[i].content.match(regex) ?? []

            for (let y = 0; y < bodyParams.length; y++) {

                let numero = bodyParams[y].replace('{{', '').replace('}}', '')
                textoBody = parameters[numero + 'BODY']?.value ? textoBody.replace(bodyParams[y], parameters[numero + 'BODY'].value) : textoBody.replace(bodyParams[y], `{{${numero}}}`)
            }

        }

        if (whatsApp.messageFooter) {
            textoFooter = whatsApp.messageFooter.content
        }

        textoFinal = [
            textoHeader,
            textoBody,
            textoFooter
        ]
            .filter(Boolean)
            .join('\n\n')

        return textoFinal

    }


    return (
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

            <Box
                sx={{
                    backgroundColor: '#e5ddd5',
                    borderRadius: 2,
                    p: 2,
                    minHeight: 250,
                }}
                align="center"
            >
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '10px',
                        maxWidth: "90%",
                        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                    }}

                >

                    <TextareaAutosize
                        value={getPreview()}
                        readOnly
                        minRows={4}
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '14px',
                            // fontWeight: 'bold',
                            fontFamily: 'inherit',
                            fontSize: '14px',
                            lineHeight: 1.5,
                            color: '#222',
                            backgroundColor: '#f7f7f7',
                            border: '1px solid #dddddd',
                            borderRadius: '8px',
                            outline: 'none',
                            resize: 'none',
                        }}
                    />


                    {getButtons().length > 0 && (
                        <Box
                            sx={{
                                marginTop: 1,
                                borderTop: '1px solid #eee',
                            }}
                        >
                            {getButtons().map((button, index) => (
                                <Button
                                    key={index}
                                    fullWidth
                                    variant="text"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 0,
                                        borderBottom:
                                            index < getButtons().length - 1
                                                ? '1px solid #eee'
                                                : 'none',
                                    }}
                                >
                                    {button.contentText}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Box>


            </Box>

        </Box>
    )













}