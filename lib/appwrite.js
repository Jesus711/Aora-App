import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';
import { appwriteConfig } from './appwriteConfig';

// Build the client to the appwrite app
const appwriteClient = new Client();

appwriteClient
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)


const account = new Account(appwriteClient);
const avatars = new Avatars(appwriteClient);
const databases = new Databases(appwriteClient);
const storage = new Storage(appwriteClient);

// Destructure the appwriteConfig properties to be accessible without
// needing to use object name
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    savedCollectionId,
    storageId,
} = appwriteConfig

export const createUser = async (email, password, username) => {

    try {
        // Creates a new users on Appwrite users auth tab
        const newAccount = await account.create(ID.unique(), email, password, username)
        // If no newAccount was created, throw error
        if(!newAccount) throw Error;

        // New Account made, continue
        // Get the account's name's initials to create the Avatar similar to Gmail
        const avatarUrl = avatars.getInitials(username)

        // Automatically sign in the user upon account creation
        await signIn(email, password);

        // Store the new user in the database
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountID: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        
        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

export const signIn = async (email, password) => {
    try {
        // Create a user session to allow user to login into their account
        const session = await account.createEmailPasswordSession(email, password)

        return session
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        // Check if there is a current user/account
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        // retrieve the current account from the database in the user collection
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountID", currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];


    } catch (error) {
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}


export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(5))]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}


export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}


export const getUserPosts = async (userID) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userID)]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}


export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error);
    }
}


export const getFilePreview = async (fileID, type) => {
    let fileUrl;

    try {
        
        if(type === "video"){
            // Get the video url
            fileUrl = storage.getFileView(storageId, fileID)
        } else if ( type === "image") {
            // Get the image url with w=2000 h=2000, gravity = top, and quality=100
            fileUrl = storage.getFilePreview(storageId, fileID, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')
        }

        // If not filee url received throw error else return
        if(!fileUrl) throw Error;

        return fileUrl;

    } catch (error) {
        throw new Error(error);
    }
}


export const uploadFile = async (file, type) => {
    if(!file) return; // No File

    const { mimeType, ...rest } = file;

    // Renamed mimeType to type for appwrite
    const asset = { type: mimeType, ...rest };

    try {
        // Store the file to the storage bucket in appwrite
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;

    } catch (error) {
        throw new Error(error);
    }
}


export const createVideo = async (form) => {
    try {
        // Get both urls
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(
            databaseId, 
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userID
            }
        )

        return newPost;

    } catch (error) {
        throw new Error(error);
    }
}


export const saveVideo = async (userID, videoID) => {
    try {

        const isSaved = await checkSavedVideo(userID, videoID)
        if (isSaved){
            return 1
        }


        const savedVideo = await databases.createDocument(
            databaseId,
            savedCollectionId,
            ID.unique(),
            {
               users: userID,
               videos: videoID
            }
        )

        return savedVideo
        
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserSavedVideos = async (userID) => {
    try {

        const posts = await databases.listDocuments(
            databaseId,
            savedCollectionId,
            [Query.equal('users', userID), Query.orderDesc('$createdAt')]
        )

        let videos = []

        for(let doc of posts.documents){
            videos.push(doc["videos"])
        }

        return videos;
        
    } catch (error) {
        throw new Error(error);
    }
}


export const removeSavedVideo = async (userID, videoID) => {
    try {
        const getDocument = await databases.listDocuments(
            databaseId,
            savedCollectionId,
            [Query.equal("videos", videoID), Query.equal("users", userID)]
        )

        if (getDocument.total == 0){
            throw new Error()
        }

        const removeID = getDocument.documents[0].$id

        const result = await databases.deleteDocument(
            databaseId,
            savedCollectionId,
            removeID
        )

        return result
        
    } catch (error) {
        throw new Error(error);
    }
}


export const checkSavedVideo = async (userID, videoID) => {
    try {
        const response = await databases.listDocuments(
            databaseId,
            savedCollectionId,
            [Query.equal("videos", videoID), Query.equal("users", userID)]
        )

        if(response.total > 0){
            return true
        }

        return false;
    } catch (error) {
        throw new Error(error);
    }
}


export const searchSavedPosts = async (userID, query) => {
    try {
        const savedVideos = await getUserSavedVideos(userID);

        let ids = [];

        for(let post of savedVideos){
            ids.push(post.$id)
        }

        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.contains("$id", ids), Query.search('title', query)]
        )

        return posts.documents;
        
    } catch (error) {
        throw new Error(error);
    }
}