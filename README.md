# Cripto View

Cripto View is a desktop application for Windows that displays the main cryptocurrencies, their values in US Dollars (USD) and Brazilian Real (BRL), and their price variations.

## Features

-   Displays the top 20 cryptocurrencies by market capitalization.
-   Shows prices in both USD and BRL.
-   Displays price variations for 1 hour, 24 hours, 7 days, 30 days, and 1 year.
-   Uses color-coding to indicate positive (green) and negative (red) price changes.
-   Fetches real-time data from the CoinGecko API.

## Technologies Used

-   [Tauri](https://tauri.app/): A framework for building lightweight, secure, and cross-platform desktop applications with a web frontend.
-   [React](https://reactjs.org/): A JavaScript library for building user interfaces.
-   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
-   [CoinGecko API](https://www.coingecko.com/en/api): The API used to fetch cryptocurrency data.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/)
-   [Rust](https://www.rust-lang.org/)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/Cripto-View.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd Cripto-View
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To run the application in development mode, use the following command:

```sh
npm run tauri dev
```

This will open the application in a new window.

## Building the Application

To build the application for production, use the following command:

```sh
npm run tauri build
```

This will create a standalone executable file in the `src-tauri/target/release` directory.
