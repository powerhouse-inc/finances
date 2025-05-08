import 'dotenv/config';

export const pullAlchemyData = async (addresses: string[]) => {
    // console.log("Pulling alchemy data for", addresses);
    const url = 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const createRequestBody = (address: string, isFromAddress: boolean) => JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
            {
                fromBlock: "0x0",
                toBlock: "latest",
                ...(isFromAddress ? { fromAddress: address } : { toAddress: address }),
                withMetadata: true,
                excludeZeroValue: true,
                maxCount: "0x3e8",
                category: [
                    "erc20"
                ],
                contractAddresses: [
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
                    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
                    "0xdC035D45d973E3EC169d2276DDab16f1e407384F", // USDS
                    "0x3231Cb76718CDeF2155FC47b5286d82e6eDA273f", // EURe
                    "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", // MKR
                    "0x56072C95FAA701256059aa122697B133aDEd9279", // SKY
                ]
            }
        ]
    });

    const fetchTransactions = async (address: string) => {
        // Fetch both inbound and outbound transactions
        const [outboundResponse, inboundResponse] = await Promise.all([
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: createRequestBody(address, true)
            }).then(response => response.json()),
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: createRequestBody(address, false)
            }).then(response => response.json())
        ]);

        // console.log("inboundResponse", inboundResponse.result.transfers);
        // Combine and sort transactions
        const allTransactions = [
            ...(outboundResponse.result?.transfers || []),
            ...(inboundResponse.result?.transfers || [])
        ].map(transaction => {
            const { metadata, ...rest } = transaction;
            return {
                ...rest,
                blockTimestamp: metadata.blockTimestamp
            };
        }).sort((a, b) => {
            // Sort by block number (descending) and then by transaction hash for same block
            const blockDiff = parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16);
            if (blockDiff !== 0) return blockDiff;
            return b.hash.localeCompare(a.hash);
        });

        console.log('Account: ', address);
        console.log('Transactions: ', allTransactions.length);

        return allTransactions;
    };

    return Promise.all(addresses.map(address => 
        fetchTransactions(address)
            .catch(error => {
                console.error('Error fetching transactions for address:', address, error);
                return [];
            })
    ));
}
