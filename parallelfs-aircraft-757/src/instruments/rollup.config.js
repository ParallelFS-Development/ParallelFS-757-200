'use strict';

const os = require('os');
const fs = require('fs');
const image = require('@rollup/plugin-image');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const tailwindcss = require('tailwindcss');

const instrumentTemplate = require('./msfs-react-plugin');

const TMPDIR = `${os.tmpdir()}/pfs757-instruments-gen`;

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

const extraInstruments = [];

function makePostcssPluginList(instrumentPath) {
    const usesTailwind = fs.existsSync(`${__dirname}/src/${instrumentPath}/tailwind.config.js`);

    return [tailwindcss(usesTailwind ? `${__dirname}/src/${instrumentPath}/tailwind.config.js` : undefined)];
}

function getInstrumentsToCompile() {
    const baseInstruments = fs
        .readdirSync(`${__dirname}/src`, { withFileTypes: true })
        .filter((d) => d.isDirectory() && fs.existsSync(`${__dirname}/src/${d.name}/config.json`));

    return [
        ...baseInstruments.map(({ name }) => ({ path: name, name, isInstrument: true })),
        ...extraInstruments.map((def) => ({ ...def, isInstrument: false }))
    ];
}

function getTemplatePlugin({ name, config, imports = [], isInstrument }) {
    return instrumentTemplate({
        name,
        config,
        imports,
        getCssBundle() {
            return fs.readFileSync(`${TMPDIR}/${name}-gen.css`).toString();
        },
        outputDir: `${__dirname}/../../PackageSources/html_ui/Pages/VCockpit/Instruments/`,
        instrumentDir: `generated/${name}`
    });
    // eslint-disable-next-line no-else-return
}

module.exports = getInstrumentsToCompile().map(({ path, name, isInstrument }) => {
    const config = JSON.parse(fs.readFileSync(`${__dirname}/src/${path}/config.json`));

    return {
        input: `${__dirname}/src/${path}/${config.index}`,
        output: {
            file: `${TMPDIR}/${name}-gen.js`,
            format: 'iife'
        },
        plugins: [
            image(),
            nodeResolve({ extensions }),
            commonjs({ include: /node_modules/ }),
            babel({
                presets: [
                    ['@babel/preset-env', { targets: { safari: '11' } }],
                    ['@babel/preset-react', { runtime: 'automatic' }],
                    ['@babel/preset-typescript']
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    ['@babel/plugin-transform-runtime', { regenerator: true }]
                ],
                babelHelpers: 'runtime',
                compact: false,
                extensions
            }),
            replace({ 'process.env.NODE_ENV': '"production"' }),
            postcss({
                use: { sass: {} },
                plugins: makePostcssPluginList(path),
                extract: `${TMPDIR}/${name}-gen.css`
            }),
            getTemplatePlugin({
                name,
                path,
                imports: [
                    '/JS/dataStorage.js',
                    '/JS/SimPlane.js',
                    '/JS/simvar.js',
                    '/Pages/VCockpit/Instruments/FlightElements/WaypointLoader.js',
                    '/Pages/VCockpit/Instruments/Shared/FlightElements/Runway.js',
                    '/Pages/VCockpit/Instruments/FlightElements/Waypoint.js',
                    '/Pages/VCockpit/Instruments/Shared/FlightElements/Approach.js',
                    '/Pages/VCockpit/Instruments/NavSystems/Shared/LogicElements/SearchField.js',
                    '/Pages/VCockpit/Instruments/Shared/FlightElements/FlightPlan.js',
                    '/Pages/VCockpit/Instruments/Shared/Utils/RadioNav.js',
                    '/Pages/VCockpit/Instruments/NavSystems/Shared/NavSystem.js',
                    '/Pages/VCockpit/Instruments/Shared/FlightElements/GeoCalc.js'
                ],
                config,
                isInstrument
            })
        ]
    };
});
