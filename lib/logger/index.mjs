const noop = () => null;

/**
 * Logger for application, proxy to console functions
 * @return {Proxy}
 */
export default new Proxy({}, {
	get: (obj, prop) => prop in console
		? console[prop] // eslint-disable-line no-console
		: noop
	,
});
