import { pullAlchemyData } from "./utils/pullAlchemyData.js";

export type ImportExampleParams = {
    addresses: string[],
}

export const run = async (params: ImportExampleParams) => {
    console.log("Importing transactions for addresses:", params.addresses);
    const results = await pullAlchemyData(params.addresses);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    // console.log("pulling", results.map(r => r.result.transfers).length, "transactions");
    console.log(results);
    console.log("Done.");
};
