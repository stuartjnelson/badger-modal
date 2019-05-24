import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve'

module.exports = {
    input: 'js/behaviour.js',
    output: {
        file: 'js/main.js',
        format: 'iife' // @TODO: Change for release
    },
    plugins: [
        scss({
            output: 'css/badger-modal.css'
        }),
        serve('./')
    ]
}