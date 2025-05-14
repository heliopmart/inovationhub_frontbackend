export async function getRegisterIn(email:string, password:string, name:string, curse: string, type: "discente" | "docente"): Promise<boolean> {
    try {
        const res = await fetch('/api/auth/auth.register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
                "name": name,
                "curse": curse,
                "type": type
            })
        });

        const response = await res.json()

        console.log(response)

        if(response.error){
            return false
        }

        if(response.status){
            return true
        }

        return false
    } catch (ex) {
        console.error("function.register > getRegisterIn | Error: " + ex);
        return false
    }
}
