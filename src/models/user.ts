import { Profile } from "./profile";

export class User {
    _id: string;
    name: string;
    email: string;
    password: string;
    active: boolean
    profile: Profile;

}