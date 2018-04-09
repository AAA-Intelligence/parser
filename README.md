# parser
WhatsApp parser to create a chat corpus

# preconditions
- git installed
- node installed
- yarn installed
- python installed


# how to run
## Installation

Clone repository:

```sh
git clone https://github.com/AAA-Intelligence/parser
```

Install dependencies:

```sh
yarn
pip install -r requirements.txt
```

## Setup

Put your chat.txt file into the root path of the repository

## Run

#### macOS / Linux

```sh
./parse.sh "Name of first person" "Name of second person"
```

#### Windows

```powershell
.\parse.ps1 "Name of first person" "Name of second person"
```

You should see your parsed chat in the /export folder and the generated chat data in /chat-data.
