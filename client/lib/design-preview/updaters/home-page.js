import assign from 'lodash/assign';

let previousCustomizations = {};

export default function homePage( previewDoc, customizations, fetchPreviewMarkup ) {
	if ( hasHomePageChanged( previousCustomizations, customizations ) ) {
		fetchPreviewMarkup();
	}
	previousCustomizations.homePage = assign( {}, customizations.homePage );
}

function hasHomePageChanged( prevCustomizations, customizations ) {
	if ( ! customizations.homePage ) {
		return false;
	}
	return ( JSON.stringify( prevCustomizations.homePage ) !== JSON.stringify( customizations.homePage ) );
}
