export const VALIDATION_MESSAGES = {
	BAD_REQUEST: "Bad Request",
	requiredField: (fieldName: string): string => {
		return `${ fieldName } is required`;
	},
	maxLength: (fieldName: string, lengthMax: number): string => {
		return `${ fieldName } length must not exceed ${ lengthMax } characters`;
	},
	minLength: (fieldName: string, lengthMin: number): string => {
		return `${ fieldName } length must be at least ${ lengthMin } characters`;
	},
	emailFormat: (fieldName: string): string => {
		return `${ fieldName } must be a valid email format`;
	},
};
