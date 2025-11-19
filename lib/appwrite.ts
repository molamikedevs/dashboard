import { Client, Account } from 'appwrite';

export const client = new Client();
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

client
    .setEndpoint(endpoint)
    .setProject(projectId); 

export const account = new Account(client);
export { ID } from 'appwrite';
