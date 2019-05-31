import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

const outputDev = {
    file: 'js/main.js',
    format: 'iife' // @TODO: Change for release
};

const outputBuild = [
    
    {
        file: (process.env.NODE_ENV === 'production' && 'dist/badger-modal.min.js' || 'dist/badger-modal.js'),
        format: 'umd'
    },
    {
        file: (process.env.NODE_ENV === 'production' && 'dist/badger-modal.esm.min.js' || 'dist/badger-modal.esm.js'),
        format: 'es',
    }
];


module.exports = {
    input: 'js/behaviour.js',
    output: (process.env.NODE_ENV !== 'production' ? outputDev : outputBuild),
    plugins: [
        (process.env.NODE_ENV !== 'production' && serve('./')),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        ( process.env.NODE_ENV === 'production' && babel({exclude: 'node_modules/**'}) ),
        scss({
            output:  (process.env.NODE_ENV !== 'production' ? 'css/badger-modal.css' : 'dist/css/badger-modal.css')
        }),
        (process.env.NODE_ENV === 'production' && terser()),
    ]
}