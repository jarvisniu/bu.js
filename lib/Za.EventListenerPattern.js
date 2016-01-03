/**
 * Za.EventListenerPattern - JavaScript event listener pattern for custom objects
 * @author Jarvis Niu - http://www.jarvisniu.com/
 */

var Za = Za || {};

Za.EventListenerPattern = function () {

    'use strict';

    var types = {};

    this.addEventListener = function ( type, listener ) {

        var listeners = types[ type ];

        if ( listeners == undefined ) {

            listeners = types[ type ] = [];

        }

        if ( listeners.indexOf( listener ) === - 1 ) {

            listeners.push( listener );

        }

    };

    this.addOnceEventListener = function ( type, listener ) {

        listener.once = true;

        this.addEventListener( type, listener );

    };

    this.removeEventListener = function ( type, listener ) {

        var listeners = types[ type ];

        if ( listeners !== undefined ) {

            var index = listeners.indexOf( listener );

            if ( index !== - 1 ) {

                listeners.splice( index, 1 );

            }

        }

    };

    this.hasEventListener = function ( type, listener ) {

        var listeners = types[ type ];

        if ( listeners !== undefined && listeners.indexOf( listener ) > - 1 ) {

            return true;

        }

        return false;

    };

    this.clearEventListeners = function ( type ) {

        var listeners = types[ type ];

        if ( listeners !== undefined ) {

            listeners.length = 0;

        }

    };

    this.listEventListeners = function ( type ) {

        var listeners = types[ type ];

        if ( listeners !== undefined ) {

            var listenerNames = [];

            for ( var i = 0; i < listeners.length; i ++ ) {

                listenerNames.push( listeners[ i ].name );

            }

            return listenerNames;

        } else {

            return null;

        }

    };

    this.triggerEvent = function ( type, eventData ) {

        var listeners = types[ type ];

        if ( listeners !== undefined ) {

            eventData = eventData || {};

            eventData.target = this;

            for ( var i = 0; i < listeners.length; i ++ ) {

                var listener = listeners[ i ];

                listener.call( this, eventData );

                if ( listener.once ) {

                    listeners.splice( i, 1 );

                    i --;

                }

            }

        }

    };

    this.on = this.addEventListener;

    this.off = function ( type, listener ) {

        if ( listener !== undefined ) {

            this.removeEventListener( type, listener );

        } else {

            this.clearEventListeners(type);

        }

    };

    this.once = this.addOnceEventListener;

};
