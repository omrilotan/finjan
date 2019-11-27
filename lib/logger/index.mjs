const noop = () => null;

// Store a local copy of console functions
const con = Object.assign(
	{},
	...Object.entries(console).map(([key, value]) => ({[key]: value})),
);

/**
 * Logger for application, proxy to console functions
 * @return {Proxy}
 */
export default new Proxy({}, {
	get: (obj, prop) => prop in con
		? con[prop]
		: noop
	,
});
