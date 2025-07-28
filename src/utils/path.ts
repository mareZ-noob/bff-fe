export const Path = {
	root: {
		path: "/",
	},
	login: {
		path: "/login",
	},
	register: {
		path: "/register",
	},
	forgotPassword: {
		path: "/forgot-password",
	},
	resetPassword: {
		path: "/reset-password",
	},
	about: {
		path: "/about",
	},
	forum: {
		path: "/forum",
	},
	payment: {
		path: "/payment",
	},
	vnpayPaymentSuccess: {
		path: "/vn-pay/payment-success",
	},
	vnpayPaymentFail: {
		path: "/vn-pay/payment-fail",
	},
	stripePaymentSuccess: {
		path: "/stripe/payment-success",
	},
	stripePaymentFail: {
		path: "/stripe/payment-cancel",
	},
	user: {
		path: "/",
		outlets: {
			dashboard: {
				path: "/dashboard",
			},
			profile: {
				path: "/profile",
			},
		},
	},
};
