import * as firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyDEa1IyE4mQRVJ97HxXGTJ_hz3Ee1XurIQ",
    authDomain: "wilyapp-a01c2.firebaseapp.com",
    projectId: "wilyapp-a01c2",
    storageBucket: "wilyapp-a01c2.appspot.com",
    messagingSenderId: "983102689250",
    appId: "1:983102689250:web:0c646a58ef7669fddaf3bb"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();