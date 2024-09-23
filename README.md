# Lottery Smart Contract

This project demonstrates how to write and test a smart contract to simulate a lottery using tokens on the Algorand blockchain.

## Project Structure

- `contracts/`: Contains the smart contract code.
- `__test__/`: Contains the test cases for the smart contract.
- `node_modules/`: Contains the project dependencies.
- `README.md`: This file.

## Prerequisites

- Node.js and npm installed.
- Algorand Sandbox or a local Algorand node running.
- Algorand SDK for JavaScript/TypeScript.

## Getting Started

### Install Dependencies

Run the following command to install the project dependencies:

\\\sh
npm install
\\\

### Smart Contract

The smart contract is located in the `contracts/` directory. It defines a lottery system where users can buy tickets using tokens.

### Testing

The tests are located in the `__test__/` directory. They use Jest and the Algorand SDK to simulate interactions with the smart contract.

### Running Tests

To run the tests, use the following command:

\\\sh
npm test
\\\

### Example Usage

Here is an example of how to use the smart contract and run the tests:

1. **Emit Tokens**: Create and emit tokens for the lottery.
2. **Opt-In**: Opt-in to the token asset.
3. **Buy Tickets**: Transfer tokens to buy lottery tickets.

### Configuration

The configuration for the Algorand client and accounts is set up in the test files. Ensure you have the correct Algorand node details and accounts configured.

## Additional Resources

- [Algorand SDK Documentation](https://developer.algorand.org/docs/sdks/)
- [AlgoKit Documentation](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md)

## License

This project is licensed under the MIT License.

Author: Dimar Borda
