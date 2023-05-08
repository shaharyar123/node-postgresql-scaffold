import type { User } from "@/modules/user/models";

export type IRegisterRequest = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
};

export type IRegisterResponse = {
	user: User;
};
