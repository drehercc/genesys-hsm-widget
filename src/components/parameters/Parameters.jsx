import {
    Box,
    Typography,
    Stack,
    TextField

} from '@mui/material'

export default function Parameters({ template, parameters, setParameters }) {

    function getParams() {

        if (!template) {
            return []
        }

        const templateParams = []
        // const template = getSelectedTemplate()
        const regex = /{{\w*}}/g;
        const whatsApp = template.messagingTemplate.whatsApp

        if (whatsApp.header && whatsApp.header.type == "Text") {
            const headerParams = whatsApp.header.content.match(regex) ?? [];
            if (headerParams.length > 0) {
                templateParams.push({ type: "HEADER", fields: headerParams })
            }

        }

        for (let i = 0; i < template.texts.length; i++) {
            const bodyParams = template.texts[i].content.match(regex) ?? []
            if (bodyParams.length > 0) {
                templateParams.push({ type: "BODY", fields: bodyParams })
            }

        }
        //console.log(templateParams)
        return templateParams
    }

    return (
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
                {getParams().map((param) => {
                    return (
                        <Box key={param.type}>

                            {param.fields.map((field) => {

                                const formatedField = field
                                    .replace('{{', '')
                                    .replace('}}', '')

                                return (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label={param.type}
                                        key={`${param.type}_${field}`}
                                        variant="outlined"
                                        value={
                                            parameters[
                                                formatedField + param.type
                                            ]?.value ?? ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value

                                            setParameters((prev) => {
                                                const temp = { ...prev }
                                                const key = formatedField + param.type

                                                if (!value) {
                                                    delete temp[key]
                                                } else {
                                                    temp[key] = {
                                                        value,
                                                        type: 'text'
                                                    }
                                                }

                                                return temp
                                            })
                                        }}
                                    >
                                        {field}
                                    </TextField>
                                )

                            })}
                        </Box>
                    )


                })}
            </Stack>
        </Box>


    )









}