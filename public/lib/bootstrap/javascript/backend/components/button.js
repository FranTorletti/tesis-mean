/* ========================================================================
 * button.js
 * Page/renders: components-button.html
 * Plugins used: ladda
 * ======================================================================== */

/* global Ladda */

'use strict';

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'ladda'
        ], factory);
    } else {
        factory();
    }
}(function () {

    $(function () {
        // Ladda button
        // ================================
        Ladda.bind('.btn.ladda-button', { timeout: 5000 } );

        // Bind progress buttons and simulate loading progress
        Ladda.bind('.btn.ladda-button.ladda-progress', {
            callback: function( instance ) {
                var progress = 0;
                var interval = setInterval( function() {
                    progress = Math.min( progress + Math.random() * 0.1, 1 );
                    instance.setProgress( progress );

                    if( progress === 1 ) {
                        instance.stop();
                        clearInterval( interval );
                    }
                }, 200 );
            }
        });
    });
    
}));