import type { UserModel } from "@/modules/user/models";

export type TRegisterRequest = {
	userFirstName: string;
	userLastName: string;
	userEmail: string;
	userPassword: string;
};

export type TRegisterResponse = {
	user: UserModel;
};
