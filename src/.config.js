export const env = "development"
// Config from Firebase Console
export const firebase = {
	apiKey: process.env.apiKey, 
	authDomain: `${process.env.projectId}.firebaseapp.com`,
	databaseURL: `https://${process.env.projectId}.firebaseio.com`,
}

// Config for react-redux-firebase
// For more details, visit http://docs.react-redux-firebase.com/history/v2.0.0/docs/api/enhancer.html
export const reduxFirebase = {
	userProfile: 'users', // root that user profiles are written to
	// updateProfileOnLogin: false, // enable/disable updating of profile on login
	// enableLogging: false, // enable/disable Firebase Database Logging
	// presence: 'presence',
	// autoPopulateProfile: true, // keep auto population of profile from v1
	// profileParamsToPopulate: [
	//   // create queries for profile population (remember to use populate)
	//   { child: 'cars', root: 'cars' }
	// ],
	// useFirestoreForProfile: true, // Use Firestore to store profile
	// profileParamsToPopulate: [{ child: 'cars', root: 'cars' }] // gather data for populating profile params
	// profileDecorator: (userData) => ({ email: userData.email }) // customize format of user profile
}

export default { env, firebase, reduxFirebase }
