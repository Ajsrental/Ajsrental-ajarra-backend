export type DOJAHBvnResponse = {
    entity: {
        bvn: string;
        nin?: string;
        first_name: string;
        last_name: string;
        middle_name: string;
        gender: string;
        date_of_birth: string;
        phone_number1: string;
        image?: string;
        photo?: string;
        phone_number: string;
    }
}

export type DOJAHNinResponse = {
    entity: {
        nin: string;
        bvn?: string;
        first_name: string;
        last_name: string;
        middle_name: string;
        phone_number: string;
        date_of_birth: string; //"1982-01-01";
        image?: string;
        photo?: string;
        gender: string; //"m";
        phone_number1?: string; //"08012345678";
    };
};