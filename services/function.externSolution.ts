import { GetInvestorReturn } from "@/types/interfacesSql"

export async function getInvestor(): Promise<GetInvestorReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Investor',
                select: `id, name, descriptionInvestment, description, image, link, color`
            })
        });

        return { st: true, value: await res.json() };
    } catch (ex) {
        console.error("function.externSolution > getInvestor | Error: " + ex);
        return { st: false, value: [] };
    }
}

