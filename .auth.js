module.exports = {
	firebase: {
		"type": "service_account",
		"project_id": "partypeople-b736d",
		"private_key_id": process.env.Private_Key_Id,
		"private_key": process.env.Private_Key_Id ? process.env.PRIVATEKEY.replace(/\\n/g, '\n') : "",
		"client_email": "firebase-adminsdk-3smir@partypeople-b736d.iam.gserviceaccount.com",
		"client_id": process.env.client_id,
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://accounts.google.com/o/oauth2/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3smir%40partypeople-b736d.iam.gserviceaccount.com"
	},
    firebaseClient: {
	    apiKey: ""+process.env.apiKey,
	    authDomain: "partypeople-b736d.firebaseapp.com",
	    databaseURL: "https://partypeople-b736d.firebaseio.com",
	    projectId: "partypeople-b736d",
	    storageBucket: "partypeople-b736d.appspot.com",
	    messagingSenderId: "958613424454"
    }
}
console.log(process.env.apiKey)
