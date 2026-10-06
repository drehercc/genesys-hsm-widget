import platformClient from 'purecloud-platform-client-v2';
import { clientConfig } from '../clientconfig';


const client = platformClient.ApiClient.instance
const { clientId, redirectUri, environment, libraryId } = clientConfig;

// const searchApi = new platformClient.SearchApi();
const usersApi = new platformClient.UsersApi();
// const analyticsApi = new platformClient.AnalyticsApi();
// const tokensApi = new platformClient.TokensApi();
// const routingApi = new platformClient.RoutingApi();
// const presenceApi = new platformClient.PresenceApi();
const conversationsApi = new platformClient.ConversationsApi();
const responseManagementApi = new platformClient.ResponseManagementApi()
const integrationsApi = new platformClient.IntegrationsApi()
const cache = {};

//default values
const authPopUpConfiguration = {
    "usePopup": true,
    "popupTimeout": 120000,
    "notifyPopup": false,
    "autoClosePopup": true,
    "autoClosePopupDelay": 1000,
    "popupTarget": "_blank",
    "popupWindowFeatures": "popup=true,width=600,height=500",
    "overridePopupUrl": undefined,
    "overridePopupUrlParameters": undefined,
    "overridePopupUrlAuthParameters": false,
    "useWindowReplace": false,
    "overrideWindowReplaceUri": undefined,
    "waitForLoginPromise": true
}

client.updateAuthPopupConfiguration(authPopUpConfiguration)

client.onAuthPopupStatus = (status, msg, identifier) => {
    console.log(`AUTH POPUP STATUS RECEIVED: status=${status}, msg=${msg}, identifier=${identifier}`);
    // status == "INIT": Authentication Popup in progress -> sets UI
    // status == "ERROR" | "AUTH_ERROR" | "TIMEOUT" : Authentication Error -> sets UI
    // status == "AUTHENTICATED" : Authentication Success -> sets UI
    // status == "ABORTED" : Authentication Aborted -> sets UI
    // status == "REDIRECTING" : About to replace location url -> sets UI
}
async function withAuthentication(apiCall) {
    try {
        console.log('[AUTH] Executando API call...');
        const response = await apiCall();
        console.log('[AUTH] API call terminou com sucesso');

        return response;
    } catch (error) {
        console.log('[AUTH] API call falhou:', error);
        console.log('[AUTH] status:', error?.status);

        const status = error?.status || error?.statusCode;

        if (status !== 401) {
            throw error;
        }

        console.log('[AUTH] 401 detectado. Reautenticando...');

        await authenticate();

        console.log('[AUTH] Autenticação terminou. Repetindo API call...');

        return await apiCall();
    }
}
export async function authenticate() {
    client.setEnvironment(environment);
    // client.setAccessToken()
    return client.loginPKCEGrant(
        clientId,
        redirectUri,
        { state: 'state' }
    )
}

export async function getUserMe(skipCache = false) {
    if (skipCache) {
        return usersApi.getUsersMe({
            expand: ['routingStatus', 'presence'],
        });
    } else if (cache['userMe']) {
        return cache['userMe'];
    } else {
        try {
            cache['userMe'] = await withAuthentication(() => usersApi.getUsersMe({
                    expand: ['routingStatus', 'presence'],
                }))

            return cache['userMe'];
        } catch (err) {
            console.error(err)
        }
    }
}

export async function getMessageIntegrations() {

    try {
        let opts = {
            "pageSize": 100, // Number | Page size
            "pageNumber": 1, // Number | Page number
        };
        const response = await withAuthentication(() => conversationsApi.getConversationsMessagingIntegrationsWhatsapp(opts))
        // const response = await conversationsApi.getConversationsMessagingIntegrationsWhatsapp(opts)
        console.log(response)
        // const response = await conversationsApi.getConversationsMessagingIntegrations(opts)
        return response.entities.filter(entity => entity.status == "Active").map((integration) => {
            const { id, phoneNumber, name } = integration

            return { id, phoneNumber, name }
        })
    }
    catch (error) {
        console.log(error)
        return {}
    }

}

export async function getMessageTemplates() {
    // String | Library ID
    let opts = {
        "pageNumber": 1, // Number | Page number
        "pageSize": 100, // Number | Page size

    };

    try {
        const response = await withAuthentication(() => responseManagementApi.getResponsemanagementResponses(libraryId, opts))
        // const response = await responseManagementApi.getResponsemanagementResponses(libraryId, opts)

        const messageTemplates = response.entities.filter(template => template.responseType == "MessagingTemplate")
        return messageTemplates;

    } catch (error) {
        console.log(error)
        return []
    }

}

export async function postDataAction(body) {


    let actionId = "custom_-_4068ed47-5203-484b-90ec-f9378ef043a1"; // String | actionId
    let genesysBody = { body: JSON.stringify(body) }; // {String: Object} | Map of parameters used for variable substitution.
    console.log(genesysBody)

    let opts = {
        "flatten": false // Boolean | Indicates the response should be reformatted, based on Architect's flattening format.
    };

    // Execute Action and return response from 3rd party.  Responses will follow the schemas defined on the Action for success and error.

    const response = await withAuthentication(() => integrationsApi.postIntegrationsActionExecute(actionId, genesysBody, opts))
    // const response = await integrationsApi.postIntegrationsActionExecute(actionId, genesysBody, opts)
    console.log(response)


}

// export function getUserByEmail(email: string) {
//     const body = {
//         pageSize: 25,
//         pageNumber: 1,
//         query: [{
//             type: "TERM",
//             fields: ["email", "name"],
//             value: email
//         }]
//     };
//     return searchApi.postUsersSearch(body);
// }

// export async function getQueues(userId: string, skipCache: boolean = false) {
//     if (skipCache) {
//         return usersApi.getUserQueues(userId);
//     } else if (cache['queues']){
//         return cache['queues'];
//     } else {
//         try {
//             cache['queues'] = await usersApi.getUserQueues(userId);
//             return cache['queues'];
//         } catch (err) {
//             console.error(err)
//         }
//     }
// }

// export function getUserRoutingStatus(userId: string) {
//     return usersApi.getUserRoutingstatus(userId);
// }

// export function logoutUser(userId: string) {
//     return Promise.all([
//         tokensApi.deleteToken(userId),
//         presenceApi.patchUserPresence(userId, 'PURECLOUD', {
//             presenceDefinition: { id: clientConfig.offlinePresenceId }
//         })
//     ])
// }

// export async function logoutUsersFromQueue(queueId: string) {
//     routingApi.getRoutingQueueMembers(queueId)
//         .then((data: any) => {
//             return Promise.all(data.entities.map((user: any) => logoutUser(user.id)));
//         })
//         .catch((err: any) => {
//             console.error(err);
//         })
// }

// export function getQueueObservations(queues: IQueue[]) {
//     const predicates = queues.map((queue: IQueue) => {
//         return {
//             type: 'dimension',
//             dimension: 'queueId',
//             operator: 'matches',
//             value: queue.id
//         }
//     })
//     const body = {
//         filter: {
//            type: 'or',
//            predicates
//         },
//         metrics: [ 'oOnQueueUsers', 'oActiveUsers' ],
//     }
//     return analyticsApi.postAnalyticsQueuesObservationsQuery(body);
// }


// export function getUserDetails(id: string, skipCache: boolean = false) {
//     if (skipCache) {
//         let tempDetails: any = {};
//         return usersApi.getUser(id)
//             .then((userDetailsData: any) => {
//                 tempDetails = userDetailsData;
//                 return presenceApi.getUserPresence(id, 'purecloud')
//             })
//             .then((userPresenceData: any) => {
//                 tempDetails['presence'] = userPresenceData;
//                 return tempDetails;
//             })
//             .catch((err: any) => {
//                 console.error(err);
//             });
//     } else if (cache['userDetails']){
//         return cache['userDetails'];
//     } else {
//         return usersApi.getUser(id)
//             .then((userDetailsData: any) => {
//                 cache['userDetails'] = userDetailsData || {};
//                 return presenceApi.getUserPresence(id, 'purecloud')
//             })
//             .then((userPresenceData: any) => {
//                 cache['userDetails']['presence'] = userPresenceData;
//                 return cache['userDetails']
//             })
//             .catch((err: any) => {
//                 console.error(err);
//             });
//     }
//   }
