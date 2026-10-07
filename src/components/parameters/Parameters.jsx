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

        // console.log(template.substitutions)

        return template.substitutions
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
                {getParams().map((substitution) => (
                    <TextField
                        key={substitution.id}
                        fullWidth
                        size="small"
                        label={substitution.id}
                        variant="outlined"
                        value={parameters[substitution.id] ?? ''}
                        onChange={(e) => {
                            const value = e.target.value

                            setParameters(prev => ({
                                ...prev,
                                [substitution.id]: value
                            }))
                        }}
                    />
                ))}
            </Stack>
        </Box>
    )
}