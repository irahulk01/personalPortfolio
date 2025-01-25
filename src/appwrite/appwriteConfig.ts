import { Client, Databases, ID } from "appwrite";

const client = new Client();
const DATABASE_ID = "659914229e843aafd111"
const DOCUMENT_ID = "65999b89d71f0d8c2bd9"

//visit
const COLLECTION_ID = "6599144106c224e1f171"
// form
const FormDataID = "659bdf1143702ca43d4c"
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("659913a6b5fe3e9ec66c");

const databases = new Databases(client);

export { client, databases, DATABASE_ID, COLLECTION_ID, DOCUMENT_ID,FormDataID,ID };