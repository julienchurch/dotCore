'use strict';

window.Core.Lightbox = ( function() {

    function Lightbox( lightbox, config ) {
        // The element that will serve as the lightbox modal window
        this.lightbox = lightbox;
     /* The targets that are clicked to open the lightbox window.
        Typically this will be your thumbnails, but there are cases 
        where you might do something along these lines: 

            <img src="your_thumbnail.jpg" /> 
            <button>Click here to view full resolution!</button>

        This module doesn't care how many links point to the full-
        resolution image, as each target will contain its own
        reference to the image it ultimately opens. */
        this.targets = [];

        if ( config ) {
            for ( var key in config ) {
                if ( this.config.hasOwnProperty(key) ) {
                    this.config[key] = config[key];
                }
            }
        }

        this.preload();
    }

    // The useDataAttribute and dataAttribute properties are designed to extend
    // the current functionality whenever I get the time to do it. In essence
    // they target elements with the `data-core="lightbox"` attribute and auto-
    // collect them into an array
    Lightbox.prototype.config = { useDataAttribute : true 
                                , dataAttribute    : "data-core"
                                , preload          : true
                                , optimizePreload  : true };

    Lightbox.prototype.compileTargets = function( targetSelector, URIAttribute ){
        targets = document.querySelectorAll( targetSelector );
        targets = window.Core.arrayLikeToArray( targets );
        var compiledTargetObject = targets.map( function( t ) {
            return { target : t
                   , fullresURI : t.getAttribute( URIAttribute ) };
        } );
        return compiledTargetObject;
    }

    // Checks that the targets are well-formed
    Lightbox.prototype._verifyTargets = function( targets ) {
        return ( targets.map( function( t ) {
            for ( var key in t ) {
                if ( ( key === "target" ) && ( t[key].isElement ) ) {
                    return true;
                } 
            }
            return false;
        } ) );
    }

    Lightbox.prototype.addTargets = function( targets ) {
        // Alias `this` (i.e., `Lightbox`) to `L`
        var L = this;
        console.log( targets );
        console.log( "The verification is: ",this._verifyTargets( targets ) );
        if ( L._verifyTargets( targets ) ) {
            targets.forEach( function( t ) {
                for ( var key in t ) {
                    // Using `node` to ensure we have an element to use as a target
                    var node;
                    if ( key === "target" ) {
                        node = t[key];
                        L.targets.push( node );
                    }    
                    // For any keys != "target", attach them as properties to the
                    // node we just inserted into `L.targets`
                    else {
                        node[key] = t[key];
                    }
                }
            } );
        }
        L.targets.forEach( function( target ) {
            target.addEventListener( "mouseup", function() {
                L._open( target );
            } );
        } );
    }

    Lightbox.prototype._open = function( target ) {
        // `target.fullres` is the full resolution image element itself. If the
        // `open` method is fired before preloading has finished, make sure we
        // still have access to the element by getting it & attaching it manually
        if ( !target.fullres ) {
            target.fullres = this._getFullres( target.fullresURI );
        }
        document.body.appendChild( target.fullres )
    }

    // `this` = target
    Lightbox.prototype._getFullres = function( uri ) {
        var fullres = new Image();
        fullres.src = uri;
        return fullres;
    }

    Lightbox.prototype.preload = function() {
        // Alias `this` (i.e., `Lightbox`) to `L`
        var L = this;
        var pageLoaded = window.setInterval( function() {
            if ( /loaded|complete/.test( document.readyState ) ) {
                clearInterval( pageLoaded );
                L.targets.forEach( function( target ) {
                    var fullres = L._getFullres( target.fullresURI );
                    target.fullres = fullres;
                } );
            }
        }, 10 );
    }

    return Lightbox;
} )(); 
