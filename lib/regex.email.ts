
export const regexStudentEmail = /^[a-z]+\.[a-z]+\d+@academico\.ufgd\.edu\.br$/;
export const regexTeacherEmail = /^[a-z]+@ufgd\.edu\.br$/;

export function verifyEmail(email: string): "docente" | "discente" | false {
    if(regexStudentEmail.test(email)) {
        return "discente";
    }else if(regexTeacherEmail.test(email)) {
        return "docente";
    }else{
        return false;

    }

}