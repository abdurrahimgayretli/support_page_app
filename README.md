### Setup Instructions

#### Configuring

Edit a .env files ([.env.example](https://github.com/abdurrahimgayretli/support_page_app/edit/master/.env.example) to '.env' and fill in the options)

#### System setup
1. Clone the repo with `git clone https://github.com/abdurrahimgayretli/support_page_app.git` command
2. Switch to the project's root directory in terminal
3. Install the dependencies by running `npm install`
4. Once, 'npm install' is completed, run `expo start` to start the expo and react-native server
5. If it shows a QR code on the terminal as a result of 'expo start' command, then you are good to go!


Ignore the first step on 'Mobile setup' instructions given below if you already have 'Expo' app installed on your phone.

#### Mobile setup
1. Install 'Expo' application on your android/iOS device. You can find the links to Android and iOS apps [here](https://expo.io/tools#client).
2. Scan the QR code shown on the terminal.
3. Once the QR code is successfully scanned, it will take few seconds to load and render the app.

**Note** This git hook runs everytime you commit. It won't let the developer commit the code if there is any eslint issue on the files changed.
