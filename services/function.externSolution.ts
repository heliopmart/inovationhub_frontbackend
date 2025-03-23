import { GetInvestorReturn, GetEventsReturn, Events, valueEventsReturn  } from "@/types/interfacesSql"

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

export async function getEvents(): Promise<GetEventsReturn> {
    try {
        const res = await fetch('/api/query/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': 'public_xyz'
            },
            body: JSON.stringify({
                table: 'Event',
                select: `*, 
                    sponsors:EventSponsor (
                        investor:Investor (
                            name
                        )
                    )
                `
            })
        });

        return { st: true, value: await normalize(await res.json()) };
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        return { st: false, value: {event: [], eventHeld: []} };
    }

    async function normalize(data: Events[]):Promise<valueEventsReturn>{
        if(data.length == 0){
            return {event: [], eventHeld: []}
        }

        const event = data.filter((value) => !value.held);

        const eventHeld = data.filter((value) => value.held);


        return {event: event, eventHeld: eventHeld}
    }
}



