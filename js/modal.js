'use strict';

window.Core.Modal = ( function() {
    function Modal( modal ) {
        // The element that will serve as the modal window
        this.modal = modal;
        // The targets that are clicked to open the modal window
        this.targets = [];
        // Get and set the close button(s) by searching the modal's children for a
        // `data-core=modal-close` attribute. If none exist, set `null`
        this.closeButtons = this.getCloseButtons();
        // Add the mouseup event listener to the close button(s) calling the modal
        // prototype's  `close` method
        this.bindCloseButtons();
        // Configuration options
    }

    Modal.prototype.config = { useDataAttribute : true
                             , dataAttribute    : "data-core" };

    Modal.prototype.addTargets = function( targets ) {
        var Modal = this;
        targets = Core.toArray( targets );
        targets.map( function( target ) {
            target.addEventListener( "mouseup", function() {
                var templateVariables = this.templateVariables;
                Modal.open( templateVariables );
            } );
        } );
        this.targets = this.targets.concat( targets );
    }

    Modal.prototype.open = function( templateVariables ) {
        if ( this.template != undefined ) {
            this.renderTemplate( templateVariables );
        }
        classie.add( modal, "open" );
    }

    Modal.prototype.getCloseButtons = function() {
        var mc = Core.toArray( this.modal.children );
        return ( mc.filter( function( c ) {
            if ( c.hasAttribute( "data-core" ) ) {
                return c.getAttribute( "data-core" ) === "modal-close";
            } else {
                return null;
            }
        } ) );
    }

    Modal.prototype.bindCloseButtons = function() {
        if ( this.closeButtons ) {
            var P = this;
            this.closeButtons.map( function( b ) {
                b.addEventListener( "mouseup", function() {
                   P.close(); 
                } );
            } );
        }
    }

    Modal.prototype.close = function() {
        classie.remove( modal, "open" );
    }

    Modal.prototype.addTemplate = function( template ) {
        var P = this;
        this.template = template;
        this.templateTarget = ( function() {
            var modalChildren = toArray( P.modal.children );
            var templateTarget = modalChildren.filter( function( node ) {
                if ( node.hasAttribute( "data-core" ) ) {
                    return node.getAttribute( "data-core" ) === "modal-template";
                }
            });
            return templateTarget[0];
        } )(); 
    }

    Modal.prototype.makeMoustache = function( string ) {
        var re = new RegExp( "{{\\s*" + string + "\\s*}}", 'g'  );
        return re;
    }

    Modal.prototype.spliceTemplate = function( template, moustache, string ) {
        return template.replace( moustache, string );
    }

    Modal.prototype.renderTemplate = function( varret ) {
        var renderedTemplate = this.template;
        for ( var variable in varret ) {
            if ( varret.hasOwnProperty( variable ) )  {
                var moustache = this.makeMoustache( variable ),
                    retVal = varret[variable];
                renderedTemplate = this.spliceTemplate( renderedTemplate, moustache, retVal );
            }
        }
        var unusedMoustache = new RegExp( "{{(.*?)}}", "g" );
        if ( unusedMoustache.test( renderedTemplate ) ) {
            throw new Error (
                "One of your template targets hasn't supplied enough variables to the DotCore Modal template."
            );
        }
        this.templateTarget.innerHTML = renderedTemplate; 
    }

    return Modal;
} )();


























































var template = "This is a first template with the variable {{otherVar}}. It also has a variable here: {{ someVar }}, and another one here: {{   someVar }}. The final variable is here: {{ otherVar }}."; 

var template2 = "This is a second template with the variable {{ thirdVar }} hidden in it.";

function mMain() {
    var m = new Modal( document.getElementById( "modal" ) );
    m.addTemplate( template );
    m.addTargets( document.querySelectorAll( ".first" ) );
    m.targets[0].templateVariables = { someVar: "THIS IS A REPLACED VAR", otherVar: "ANOTHER ONE" }
    m.targets[1].templateVariables = { someVar: "FURTHER REPLACED", otherVar: "$$$$$$" }
    m.targets[2].templateVariables = { someVar: "RAHHHHHHHHHH", otherVar: "GOLD TEETH" }
}
