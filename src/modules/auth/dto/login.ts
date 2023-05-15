export type TLoginRequest = {
	userEmail: string;
	userPassword: string;
};

export type TLoginResponse = {
	token: string;
};
