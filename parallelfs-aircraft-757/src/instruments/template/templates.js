/*
 * Copyright (C) 2020-2021 FlyByWire Simulations and its contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const html = (imports) => `
<script type="text/html" id="A35X_INSTRUMENT_NAME_TEMPLATE">
    <div id="A35X_REACT_MOUNT">
        <h1>If you're seeing this, React didn't load.</h1>
    </div>
    <script id="A35X_BUNDLED_LOGIC">
        // Although this is a script tag, because it is a child of a custom element,
        // it will not execute. Inside \`template.js\`, we read the contents of this script
        // element, then create a new script element and append it to the document body.
        // We embed it into this file, even though it is useless, because this file can
        // be hot-reloaded, but \`template.js\` cannot.
        /* eslint-disable */
        INSTRUMENT_BUNDLE
    </script>
    <style id="A35X_BUNDLED_STYLE">
        /* same deal as above */
        INSTRUMENT_STYLE
    </style>
</script>
${imports.map(i => 
    `<script type="text/html" import-script="${i}" import-async="false"></script>\n`
)}

<script type="text/html" import-script="/JS/coherent.js"></script>

<script type="text/html" import-script="/JS/SimPlane.js"></script>

<script type="text/html" import-script="/Pages/VCockpit/Instruments/Shared/Utils/RadioNav.js"></script>

<script type="text/html" import-script="/Pages/VCockpit/Instruments/Shared/FlightElements/Runway.js"></script>
<script type="text/html" import-script="/Pages/VCockpit/Instruments/Shared/FlightElements/FlightPlan.js"></script>
<script type="text/html" import-script="/Pages/VCockpit/Instruments/Shared/FlightElements/Approach.js"></script>

<script type="text/html" import-script="/Pages/VCockpit/Instruments/Shared/FlightElements/GeoCalc.js"></script>

<script type="text/html" import-script="/Pages/VCockpit/Instruments/NavSystems/Shared/LogicElements/SearchField.js"></script>

<script type="text/html" import-script="/Pages/VCockpit/Instruments/NavSystems/Shared/NavSystem.js"></script>
<script type="text/html" import-script="/Pages/VCockpit/Instruments/Airliners/Shared/BaseAirliners.js"></script>
<script type="text/html" import-script="/Pages/VCockpit/Instruments/Airliners/Shared/FMC/FMCMainDisplay.js"></script>
<script type="text/html" import-script="/Pages/VCockpit/Instruments/Airliners/Shared/FMC/FMCDataManager.js"></script>
<script type="text/html" import-script="/Pages/VCockpit/Instruments/generated/INSTRUMENT_NAME/template.js" import-async="false"></script>
`;

const js = `
'use strict';
/* global BaseInstrument */
/* global registerInstrument */
// eslint-disable-next-line camelcase
class A35X_INSTRUMENT_NAME_Logic extends BaseInstrument {
    constructor() {
        super();
        // eslint-disable-next-line no-underscore-dangle
        let lastTime = this._lastTime;
        this.getDeltaTime = () => {
            const nowTime = Date.now();
            const deltaTime = nowTime - lastTime;
            lastTime = nowTime;
            return deltaTime;
        };
    }
    get templateID() {
        return 'A35X_INSTRUMENT_NAME_TEMPLATE';
    }
    get isInteractive() {
        // eslint-disable-next-line
        return INSTRUMENT_IS_INTERACTIVE;
    }
    get IsGlassCockpit() {
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        // This is big hack, see \`template.html\`.
        {
            const code = document.getElementById('A35X_BUNDLED_STYLE').innerHTML;
            const style = document.createElement('style');
            style.innerHTML = code;
            document.head.appendChild(style);
        }
        {
            const code = document.getElementById('A35X_BUNDLED_LOGIC').innerHTML;
            const script = document.createElement('script');
            script.innerHTML = code;
            document.body.appendChild(script);
        }
    }
    Update() {
        super.Update();
        this.dispatchEvent(new CustomEvent('update', { detail: this.getDeltaTime() }));
    }
    onInteractionEvent(event) {
        const eventName = String(event);
        this.dispatchEvent(new CustomEvent(eventName));
        this.dispatchEvent(new CustomEvent('*', { detail: eventName }));
    }
}
registerInstrument('a35x-INSTRUMENT_NAME_LOWER-element', A35X_INSTRUMENT_NAME_Logic);
`;

module.exports = [html, js];