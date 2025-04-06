/*
    @return Promise<{
        auth: boolean;
        user: {
            id: string,
            role: string,
            admin: boolean,
            allocatedArt: UUID | null,
        };
    }>
*/

export async function useAuth(){
    // TODO pegar dados dos cookies or storage
    return {
        auth: true,
        user: {
            id: "1",
            role: "allocatedLeader",
            admin: true,
            allocatedArt: "1"
        }
    }
    
}