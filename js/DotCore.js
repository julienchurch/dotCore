window.Core = ( function() {
    // Add some necessary functionality to the DOM API
    Element.prototype.isElement = true;
    Array.prototype.isArray = true;
    NodeList.prototype.isNodeList = true;
    HTMLCollection.prototype.isHTMLCollection = true;

    function arrayLikeToArray( arrayLike ) {
        return Array.prototype.slice.call( arrayLike );
    }
    return { arrayLikeToArray : arrayLikeToArray };
} )();
