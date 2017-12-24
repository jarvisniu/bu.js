// global config

import Bu from '../core/Bu.js'

let config = {
	font: '11px Verdana',
}

let cursor = 'default'
Object.defineProperty(config, 'cursor', {
	get () {
		return cursor
	},
	set (val) {
		cursor = val
		for (let bu of Bu.$bues) {
			bu.$renderer.dom.style.cursor = cursor
		}
	},
})

export default config
