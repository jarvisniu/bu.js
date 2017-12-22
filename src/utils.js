// Utils Functions

// Execute a callback function when the document is ready
function ready(cb, context, args) {
	if (document.readyState === 'complete') {
		cb.apply(context, args)
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			cb.apply(context, args)
		})
	}
}

export default {
	ready
}
