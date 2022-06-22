import { CREATE_LINK_TOKEN, CREATE_LINK_TOKEN_ERROR } from "../actions/types";

const initialState = {
	linkToken: "",
	publicToken: "",
	error: {}
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case CREATE_LINK_TOKEN:
			return {
				...state,
				linkToken: payload
			};

		case CREATE_LINK_TOKEN_ERROR:
			return {
				...state,
				publicToken: null,
				error: payload
			};
		default:
			return state;
	}
}
