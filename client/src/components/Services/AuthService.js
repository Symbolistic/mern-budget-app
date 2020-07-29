export default {
	login: (user) => {
		return fetch("/api/users/login", {
			method: "post",
			body: JSON.stringify(user),
			headers: {
				"Content-Type": "application/json",
			},
		}).then((res) => {
            if (res.status !== 401) 
                return res.json().then((data) => data);
            else 
                return { isAuthenticated: false, user: { name: "", email: "", role: "" } };
		});
	},
	register: (user) => {
		return fetch("/api/users/register", {
			method: "post",
			body: JSON.stringify(user),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => data);
	},
	logout: () => {
		return fetch("/api/users/logout")
			.then((res) => res.json())
			.then((data) => data);
	},
	isAuthenticated: () => {
		return fetch("/api/users/authenticated").then((res) => {
			if (res.status !== 401) return res.json().then((data) => data);
			else return { isAuthenticated: false, user: { name: "", email: "", role: "" } };
		});
	},
};
