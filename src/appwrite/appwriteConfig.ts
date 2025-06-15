import { Client, Databases, ID } from "appwrite";

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_PROJECT_ID);

// Environment variables from Vite
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const DOCUMENT_ID = import.meta.env.VITE_DOCUMENT_ID;
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;
const FormDataID = import.meta.env.VITE_FORMDATA_ID;

// Exporting for use in your app
const databases = new Databases(client);

export { client, databases, DATABASE_ID, COLLECTION_ID, DOCUMENT_ID,FormDataID,ID };