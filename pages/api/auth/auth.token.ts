import {AuthPrivatedToken} from "@/types/interfaceClass"

export async function AuthToken(token:string):Promise<AuthPrivatedToken>{
    if(!token) {
        return {status: false, message: "Invalid Token"}
    }

    const allowedTables = getAlloweTables(token)

    return {status: true, allowedTables}
}

function getAlloweTables(token:string){
    const public_access = ['Team', 'Investor', 'TeamInvestor', 'User', 'Resource', 'NucleiBoardOfDirectors', 'UserLogin', 'Nuclei', "InvestorInvestment", "ResourceSupplier"]

    if(token.split("_")[0] == "public"){
        return public_access
    }else{
        return [...public_access]
    }
}