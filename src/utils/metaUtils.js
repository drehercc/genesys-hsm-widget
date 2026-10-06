export async function carregarTemplates() {
    try {
        const templates = [
            {
                name: 'boas_vindas',
                parameter_format: 'POSITIONAL',
                components: [
                    {
                        type: 'HEADER',
                        format: 'TEXT',
                        text: 'Bem-vindo!'
                    },
                    {
                        type: 'BODY',
                        text: 'Olá {{1}}, seja bem-vindo à nossa empresa! Estamos felizes em ter você conosco.'
                    },
                    {
                        type: 'FOOTER',
                        text: 'Estamos à disposição para ajudar.'
                    }
                ],
                language: 'pt_BR',
                status: 'APPROVED',
                category: 'MARKETING',
                disable_ios_autofill: false,
                is_primary_device_delivery_only: false,
                id: '1000000000000001'
            },

            {
                name: 'lembrete_pagamento',
                parameter_format: 'POSITIONAL',
                components: [
                    {
                        type: 'HEADER',
                        format: 'TEXT',
                        text: 'Lembrete de pagamento de {{1}}'
                    },
                    {
                        type: 'BODY',
                        text: 'Olá {{1}}, lembramos que seu pagamento no valor de {{2}} vence em {{3}}.'
                    },
                    {
                        type: 'FOOTER',
                        text: 'Caso já tenha realizado o pagamento, desconsidere esta mensagem senhor {{1}}'
                    }
                ],
                language: 'pt_BR',
                status: 'APPROVED',
                category: 'UTILITY',
                disable_ios_autofill: false,
                is_primary_device_delivery_only: false,
                id: '1000000000000002'
            },

            {
                name: 'confirmacao',
                parameter_format: 'POSITIONAL',
                components: [
                    {
                        type: 'HEADER',
                        format: 'TEXT',
                        text: 'Confirmação {{1}} de atendimento'
                    },
                    {
                        type: 'BODY',
                        text: 'Olá {{1}}, seu atendimento está confirmado para o dia {{2}} às {{3}}.'
                    },
                    {
                        type: 'FOOTER',
                        text: 'Aguardamos você!'
                    },
                    {
                        type: 'BUTTONS',
                        buttons: [
                            {
                                type: 'QUICK_REPLY',
                                text: 'Confirmar atendimento'
                            },
                            {
                                type: 'QUICK_REPLY',
                                text: 'Cancelar atendimento'
                            }
                        ]
                    }
                ],
                language: 'pt_BR',
                status: 'APPROVED',
                category: 'UTILITY',
                disable_ios_autofill: false,
                is_primary_device_delivery_only: false,
                id: '1000000000000003'
            }
        ]

        return templates
    } catch (err) {
        console.error(err)
        throw err
    }
}