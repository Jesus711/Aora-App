import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
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
        console.log(error);
    }
}