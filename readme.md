
# Smartschool Backend

A natural language processing-powered cross-platform service for students of the future.

# Structure
![](images/flow.png)

## Installation

*You need to have `node v14.16.0` or later to run this project since we're using es6+ features*

**Clone the repository to your device.**
```bash
git clone https://github.com/codekavya/smartschool-backend.git
```
**Change your current directory into the project**
```bash
cd smartschool-backend
```
**Install dependencies**
```bash
npm i
```
**Run the project with nodemon for hot restart**
```bash
npm run dev
```
## Setup
Create a mongodb account from [https://www.mongodb.com/](https://www.mongodb.com/), make a database and obtain mongodb uri.

You need to create [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) account and create a [Text Analytics resource](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/) with Custom question-answering feature enabled, then proceed to create QnAmaker [(Guide)](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/overview/overview). Now, sign up for [Symbl](https://symbl.ai/)  Make Sure to fill in all the details in [Config](#Config). 


## Config

```js
export default {
  jwtsigninKey: "",
  mongoDbKey: "",
  localKey: "",
  SYMBL_APP_ID: "",
  SYMBL_APP_SECRET:"",
  AZURE_STORAGE_ACCOUNT_NAME: "",
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY:"",
  QnA_subscription_key: "",
  QnA_endpoint: "",
  QnA_runtime_endpoint: "",
  Resource_Name: "",
};

```
