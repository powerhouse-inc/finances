import 'dotenv/config';

export const pullAlchemyData = async (addresses: string[]) => {
    console.log("Pulling alchemy data for", addresses);
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
