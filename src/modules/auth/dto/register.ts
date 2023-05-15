import type { UserModel } from "@/modules/user/models";

export type IRegisterRequest = {
	userFirstName: string;
	userLastName: string;
	userEmail: string;
	userPassword: string;
};

export type IRegisterResponse = {
	user: UserModel;
};
