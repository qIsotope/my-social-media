import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlDnfkATgsLpsQZBb2lOkFAAIJ5zl374U",
  authDomain: "my-social-media-c3987.firebaseapp.com",
  projectId: "my-social-media-c3987",
  storageBucket: "my-social-media-c3987.appspot.com",
  messagingSenderId: "806828281441",
  appId: "1:806828281441:web:d76b43a4afd3959b21a420"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
