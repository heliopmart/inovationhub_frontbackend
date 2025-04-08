

export async function getLogIn(email:string, password:string): Promise<boolean> {
    try {
        const res = await fetch('/api/auth/auth.user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });

        const response = await res.json()

        if(response.error){
            return false
        }

        if(response.status){
            return true
        }

        return false
    } catch (ex) {
        console.error("function.team > getTeams | Error: " + ex);
        // return { st: false, value: [] };
        return false
    }
}


