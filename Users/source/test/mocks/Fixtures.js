export const UserMock = {
    "firstname": 'Service',
    "lastname": 'Commerce',
    "password": '$2a$10$mZ4Wf8h.M/g0zbSJLdV8KuX9tWaA2r3xStXavtLGlpRUVJnBq3fKW',
    "email": 'servi@gmail.com',
    "username": 'servicommerce',
    refreshTokens:['asasfqfqefqefefqf'],
    "id": '2697bd30-1fbd-4d79-8cc5-26e052141235'
}

export let SellerMock = {
    "mercadoPagoToken": '$2a$10$mZ4Wf8h.M/g0zbSJLdV8KuX9tWaA2r3xStXavtLGlpRUVJnBq3fKW',
    "collectorID": '5697ac55-1qzd-4d79-7xx5-a6e054571256',
    "userID": '2697bd30-1fbd-4d79-8cc5-26e052141235',
    "sellerScore": 4.9,
    bankAccounts:['01e4b81a-f7a4-46e5-b21f-0ba1a4120610','8a8f8b19-c8d7-4e78-b4b6-3b4cf2972e9b']
}

export const reviews = [{
    comment: 'everything fine, good seller',
    orderScore: 5,
    order:{publicationName:'A New MackBook Air 13 inch 8 gb Ram Intel i3'}
},{
    comment: 'everything fine, good seller',
    orderScore: 4.8,
    order:{publicationName:'A New Dell 16 inch 10 gb Ram Intel i5'}
}]


// _id: {
//     type: String,
//     required: true,
//     unique: true
// },
// collectorID: {
//     type: String,
//     required: true,
// },
// userID: {
//     type: String
// },
// mercadoPagoToken: {
//     type: String,
// },
// mercadoPagoRefresh: {
//     type: String,
// },
// status: {
//     type: String,
//     enum: ['active', 'inactive'],
//     required: true,
// },
// sellerScore: {
//     type: Number
// },
// bankAccounts: [{
//     type: String,
//     ref: "BankAccount"
// }]



export const WishlistMock = {
	"_id" : "dad50524-0938-1596-273c-b207e2793496",
	"userID" : "2697bd30-1fbd-4d79-8cc5-26e052141235",
	"publications" : [
		{
			"publicationName" : "A New MackBook Air 13 inch 8 gb Ram Intel i3",
			"publicationID" : "01e4b81a-f7a4-46e5-b21f-0ba1a4120610"
		},
        {
			"publicationName" : "A New MackBook Pro 15 inch 8 gb Ram Intel i7",
			"publicationID" : "73a9389d-31a0-40f9-b64a-1f675b731188"
		},
        {
			"publicationName" : "A New Dell 16 inch 10 gb Ram Intel i5",
			"publicationID" : "8a8f8b19-c8d7-4e78-b4b6-3b4cf2972e9b"
		}
	]

}
