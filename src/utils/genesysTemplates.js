export async function carregarTemplatesGenesys() {

  const templates = [{
    "id": "256c63fe-99c6-4210-9bdc-1bdc584f9882",
    "name": "teste_api",
    "version": 1,
    "libraries": [
      {
        "id": "9cbf5425-4c38-44e0-8f02-c36864497a19",
        "name": "GDI_Geral",
        "selfUri": "/api/v2/responsemanagement/libraries/9cbf5425-4c38-44e0-8f02-c36864497a19"
      }
    ],
    "texts": [
      {
        "content": "Seu exame já esta disponivel {{2}}",
        "contentType": "text/plain"
      }
    ],
    "createdBy": {
      "id": "308a8c9a-9eb4-4e8f-9b12-be00f393b7a0",
      "selfUri": "/api/v2/users/308a8c9a-9eb4-4e8f-9b12-be00f393b7a0"
    },
    "dateCreated": "2026-10-01T01:07:01.074Z",
    "substitutions": [
      {
        "id": "2"
      },
      {
        "id": "1"
      }
    ],
    "substitutionsSchema": {
      "title": "substitutions",
      "description": "Details about any text substitutions used in the texts for this response.",
      "type": "object",
      "properties": {
        "1": {
          "type": "string"
        },
        "2": {
          "type": "string"
        }
      }
    },
    "responseType": "MessagingTemplate",
    "messagingTemplate": {
      "whatsApp": {
        "name": "teste_hsm_api",
        "language": "pt_BR",
        "buttons": [
          {
            "type": "QuickReply",
            "contentText": "sim"
          },
          {
            "type": "QuickReply",
            "contentText": "nao"
          }
        ],
        "messageFooter": {
          "type": "Text",
          "content": "Obrigado!"
        },
        "header": {
          "type": "Text",
          "content": "Olá {{1}}"
        }
      }
    },
    "selfUri": "/api/v2/responsemanagement/responses/256c63fe-99c6-4210-9bdc-1bdc584f9882"
  }]

  return templates



}


